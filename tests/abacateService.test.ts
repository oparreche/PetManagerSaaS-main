import { describe, it, expect } from 'vitest';
import { createOneTimePayment, createSubscription, initAbacateSDK } from '../services/abacateService';

describe('abacateService', () => {
  it('initializes SDK without error', () => {
    initAbacateSDK();
    initAbacateSDK(); // idempotent
  });

  it('creates one-time payment', async () => {
    const res = await createOneTimePayment({
      amount: 1000,
      currency: 'BRL',
      description: 'Teste',
      customerEmail: 'user@example.com',
    });
    expect(res.ok).toBe(true);
    expect(res.referenceId).toMatch(/abacate_/);
  });

  it('creates subscription', async () => {
    const res = await createSubscription({
      amount: 5000,
      currency: 'BRL',
      description: 'Plano Premium',
      customerEmail: 'user@example.com',
      planId: 'premium',
    });
    expect(res.ok).toBe(true);
    expect(res.referenceId).toMatch(/abacate_sub_/);
  });
});