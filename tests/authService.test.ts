import { describe, it, expect, beforeEach } from 'vitest';
import { loginAdmin, loginClient } from '../services/authService';

describe('authService', () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem('csrfToken', 'test-csrf');
  });

  it('should login admin with valid credentials', async () => {
    const res = await loginAdmin('admin@petmanager.com', 'admin123');
    expect(res.ok).toBe(true);
    expect(res.session?.role).toBe('admin');
    expect(res.session?.csrfToken).toBe('test-csrf');
  });

  it('should fail admin login with invalid credentials', async () => {
    const res = await loginAdmin('bad@x.com', 'wrong');
    expect(res.ok).toBe(false);
  });

  it('should login client when tutor exists and password length ok', async () => {
    const tutors = [{ id: 't1', name: 'Ana', email: 'ana@example.com', phone: '123' }];
    const res = await loginClient('ana@example.com', '123456', tutors as any);
    expect(res.ok).toBe(true);
    expect(res.session?.role).toBe('client');
    expect(res.session?.email).toBe('ana@example.com');
  });
});