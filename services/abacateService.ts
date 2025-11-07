// Abacate Pay integration (mock + live via Supabase Edge Functions)
// Em desenvolvimento, mantemos um modo "mock" para testes locais.
// Em produção, usamos uma Edge Function para criar a cobrança e redirecionar o usuário.

export interface AbacatePaymentParams {
  amount: number; // in cents
  currency: string; // e.g., BRL
  description: string;
  customerEmail: string;
  metadata?: Record<string, string | number | boolean>;
}

export type AbacatePaymentResult = {
  ok: boolean;
  referenceId?: string;
  redirectUrl?: string; // URL de checkout do Abacate Pay
  error?: string;
};

let initialized = false;

const MODE = import.meta.env.VITE_ABACATE_MODE || 'mock';
// Opcionalmente use uma Edge Function diferente por tipo
const CREATE_CHECKOUT_FUNCTION = 'abacate-create-checkout';

import { supabase } from './supabaseClient';

export const initAbacateSDK = () => {
  if (initialized) return;
  // Example: window.Abacate.init({ key: 'pk_live_...' })
  initialized = true;
};

export const createOneTimePayment = async (
  params: AbacatePaymentParams
): Promise<AbacatePaymentResult> => {
  if (MODE === 'mock') {
    // Simula fluxo de checkout
    await new Promise((r) => setTimeout(r, 400));
    return { ok: true, referenceId: `abacate_${Date.now()}`, redirectUrl: 'https://example.com/checkout/mock' };
  }

  try {
    const { data, error } = await supabase.functions.invoke(CREATE_CHECKOUT_FUNCTION, {
      body: {
        type: 'ONE_TIME',
        amount: params.amount,
        currency: params.currency,
        description: params.description,
        customerEmail: params.customerEmail,
        metadata: params.metadata || {},
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    const referenceId = data?.referenceId || data?.id;
    const redirectUrl = data?.url || data?.redirectUrl;
    if (!redirectUrl) {
      return { ok: false, error: 'Checkout URL não retornada pelo gateway.' };
    }
    return { ok: true, referenceId, redirectUrl };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Falha ao criar pagamento no Abacate.' };
  }
};

export const createSubscription = async (
  params: AbacatePaymentParams & { planId: string }
): Promise<AbacatePaymentResult> => {
  if (MODE === 'mock') {
    await new Promise((r) => setTimeout(r, 400));
    return { ok: true, referenceId: `abacate_sub_${Date.now()}`, redirectUrl: 'https://example.com/checkout/subscription/mock' };
  }

  try {
    const { data, error } = await supabase.functions.invoke(CREATE_CHECKOUT_FUNCTION, {
      body: {
        type: 'SUBSCRIPTION',
        amount: params.amount,
        currency: params.currency,
        description: params.description,
        customerEmail: params.customerEmail,
        metadata: { ...(params.metadata || {}), planId: params.planId },
      },
    });

    if (error) {
      return { ok: false, error: error.message };
    }
    const referenceId = data?.referenceId || data?.id;
    const redirectUrl = data?.url || data?.redirectUrl;
    if (!redirectUrl) {
      return { ok: false, error: 'Checkout URL não retornada pelo gateway.' };
    }
    return { ok: true, referenceId, redirectUrl };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Falha ao criar assinatura no Abacate.' };
  }
};

// Callback handler example (would be triggered by Abacate webhook)
export const handlePaymentCallback = async (
  payload: { referenceId: string; status: 'succeeded' | 'failed'; amount: number }
) => {
  // In a real backend, verify signature, idempotency key, and update DB
  console.log('Abacate callback payload:', payload);
};
