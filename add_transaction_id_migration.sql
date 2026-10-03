-- Migration: Add transaction_id to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS transaction_id TEXT;
COMMENT ON COLUMN public.orders.transaction_id IS 'External payment transaction ID (e.g., from Paymob or Instapay)';
