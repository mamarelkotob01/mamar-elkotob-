import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface NewOrderPayload {
  id: string;
  total_amount: number;
  payment_method: string;
  created_at: string;
}

const PM_LABEL: Record<string, string> = {
  bank_transfer: 'Bank Transfer',
  instapay: 'InstaPay',
  vodafone_cash: 'Vodafone Cash',
  stripe: 'Online (Stripe)',
};

/** Generates a professional 3-beep alert using the Web Audio API */
function playOrderAlert() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const beep = (startTime: number, freq: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.4, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    // 3-tone alert: low → high → high
    beep(ctx.currentTime,        600, 0.18);
    beep(ctx.currentTime + 0.22, 900, 0.18);
    beep(ctx.currentTime + 0.44, 900, 0.28);
  } catch {
    // silently fail if AudioContext is not available
  }
}

type OrderCallback = (order: NewOrderPayload) => void;

export function useAdminOrderNotifications(
  onNewOrder: OrderCallback,
  enabled: boolean = true
) {
  const callbackRef = useRef(onNewOrder);
  callbackRef.current = onNewOrder;

  // Access React Query client to invalidate admin orders cache on new order
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return undefined;

    const channel = supabase
      .channel('admin-order-alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const order = payload.new as NewOrderPayload;

          // 1. Play audio alert
          playOrderAlert();

          // 2. Immediately refresh the admin orders list
          queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });

          // 3. Fire the UI callback (shows toast)
          callbackRef.current(order);

          // 4. Browser push notification (if permission granted)
          if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification('🛒 New Order Received!', {
              body: `${PM_LABEL[order.payment_method] ?? order.payment_method} — ${Number(order.total_amount).toFixed(2)} EGP`,
              icon: '/favicon.ico',
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[AdminNotify] ✅ Realtime subscription active on orders table');
        }
        if (status === 'CHANNEL_ERROR') {
          console.warn('[AdminNotify] ⚠️ Realtime subscription failed — falling back to 30s polling');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, queryClient]);

  /** Call once to request browser notification permission */
  const requestPermission = useCallback(async () => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  return { requestPermission };
}
