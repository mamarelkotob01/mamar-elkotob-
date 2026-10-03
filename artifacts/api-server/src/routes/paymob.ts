import { Router, Request, Response } from "express";
import crypto from "crypto";
import { z } from "zod";
import { recoveryQueue } from "../lib/recoveryQueue";
import { monitor } from "../lib/monitor";

const router = Router();

// Your Paymob HMAC Secret from the dashboard
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || "your_secret_here";

// ── SECURITY: Strict Paymob Webhook Schema ──────────────────────
// Prevents malformed payloads from causing background errors or crashes.
const PaymobPayloadSchema = z.object({
  type: z.string(),
  obj: z.object({
    id: z.number(),
    success: z.boolean(),
    amount_cents: z.number().optional(),
    created_at: z.string().optional(),
    currency: z.string().optional(),
    error_occured: z.boolean().optional(),
    has_parent_transaction: z.boolean().optional(),
    integration_id: z.number().optional(),
    is_3d_secure: z.boolean().optional(),
    is_auth: z.boolean().optional(),
    is_capture: z.boolean().optional(),
    is_refunded: z.boolean().optional(),
    is_standalone_payment: z.boolean().optional(),
    is_voided: z.boolean().optional(),
    owner: z.number().optional(),
    pending: z.boolean().optional(),
    order: z.object({
      id: z.number().optional(),
      merchant_order_id: z.string()
    }),
    source_data: z.object({
      pan: z.string().optional(),
      sub_type: z.string().optional(),
      type: z.string().optional()
    }).optional()
  })
});

/**
 * Validates the Paymob HMAC signature to ensure the request is authentically from Paymob
 */
function verifyPaymobHmac(reqBody: any, signature: string): boolean {
  if (!reqBody || !reqBody.obj) return false;
  
  const obj = reqBody.obj;
  // Join fields in the exact order required by Paymob for hashing
  const connectedString = [
    obj.amount_cents,
    obj.created_at,
    obj.currency,
    obj.error_occured,
    obj.has_parent_transaction,
    obj.id,
    obj.integration_id,
    obj.is_3d_secure,
    obj.is_auth,
    obj.is_capture,
    obj.is_refunded,
    obj.is_standalone_payment,
    obj.is_voided,
    obj.order?.id,
    obj.owner,
    obj.pending,
    obj.source_data?.pan,
    obj.source_data?.sub_type,
    obj.source_data?.type,
    obj.success
  ].join('');

  const hmac = crypto.createHmac('sha512', PAYMOB_HMAC_SECRET);
  hmac.update(connectedString);
  const calculatedSignature = hmac.digest('hex');

  return calculatedSignature === signature;
}

router.post("/webhook", (req: Request, res: Response): any => {
  const { hmac: hmacSignature } = req.query;
  const payload = req.body;

  // 1. FAIL-FAST: Immediate HMAC Security Check
  if (!hmacSignature || typeof hmacSignature !== "string" || !verifyPaymobHmac(payload, hmacSignature)) {
    monitor.error('Invalid HMAC signature — possible spoofing attempt', 'PaymobWebhook', { ip: req.ip });
    return res.status(401).json({ error: "Invalid signature" });
  }

  // 2. SCHEMA VALIDATION: Ensure payload is well-formed
  const validation = PaymobPayloadSchema.safeParse(payload);
  if (!validation.success) {
    monitor.warn('Malformed Paymob payload received', 'PaymobWebhook', { errors: validation.error.format() });
    return res.status(400).json({ error: "Invalid payload format" });
  }

  // 3. RESPOND 200: Handshake complete
  res.status(200).send("OK");

  // 4. BACKGROUND PROCESSING: Safe for event loop
  setImmediate(async () => {
    try {
      const validatedData = validation.data;

      if (!validatedData.obj.success) {
         monitor.warn(`Transaction ${validatedData.obj.id} declined`, 'PaymobWebhook');
         return;
      }

      const orderId = validatedData.obj.order.merchant_order_id;
      monitor.info(`Confirmed payment for order: ${orderId}`, 'PaymobWebhook');

      recoveryQueue.enqueue(
        `Mark order ${orderId} as paid`,
        async () => {
          // Internal DB logic here
          // This will be retried automatically by the recovery queue on failure
          monitor.info(`Order ${orderId} successfully marked as PAID in background`, 'RecoveryQueue');
        },
        5
      );

    } catch (error: any) {
      monitor.error('Critical background webhook failure', 'PaymobWebhook', {
        error: error?.message,
      });
    }
  });
});

export default router;
