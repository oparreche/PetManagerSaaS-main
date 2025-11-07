import { Tutor, UserSession } from '../types';
import { supabase } from './supabaseClient';
import { db } from './db';

// Mocked admin credentials (in production, replace with secure backend auth)
const ADMIN_EMAIL = 'admin@petmanager.com';
const ADMIN_PASSWORD = 'admin123';

export const loginAdmin = async (
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string; session?: UserSession }> => {
  // Sign in with Supabase Auth and require app_metadata.role === 'admin'
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Fallback for local dev/tests
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const csrfToken = sessionStorage.getItem('csrfToken') || '';
      const session: UserSession = {
        userId: 'admin-1',
        email,
        name: 'Administrador',
        role: 'admin',
        csrfToken,
      };
      sessionStorage.setItem('session', JSON.stringify(session));
      return { ok: true, session };
    }
    return { ok: false, error: error.message };
  }
  const user = data.user;
  // Try to resolve role via RPC fallback (roles table), then app_metadata
  let resolvedRole: string | undefined;
  try {
    const { data: rpcData } = await supabase.rpc('get_my_role');
    resolvedRole = (rpcData as any) || (user?.app_metadata as any)?.role;
  } catch {
    resolvedRole = (user?.app_metadata as any)?.role;
  }
  if (resolvedRole !== 'admin') {
    await supabase.auth.signOut();
    return { ok: false, error: 'Acesso negado: usuário não é ADMIN.' };
  }
  const csrfToken = sessionStorage.getItem('csrfToken') || '';
  const session: UserSession = {
    userId: user.id,
    email: user.email || email,
    name: (user.user_metadata as any)?.name || 'Admin',
    role: 'admin',
    csrfToken,
  };
  sessionStorage.setItem('session', JSON.stringify(session));
  return { ok: true, session };
};

export const loginClient = async (
  email: string,
  password: string,
  tutors: Tutor[]
): Promise<{ ok: boolean; error?: string; session?: UserSession }> => {
  // Sign in with Supabase Auth and require app_metadata.role === 'client'
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Fallback for local dev/tests
    const tutor = tutors.find((t) => t.email === email);
    if (tutor && password.length >= 6) {
      const csrfToken = sessionStorage.getItem('csrfToken') || '';
      const session: UserSession = {
        userId: tutor.id,
        email: tutor.email,
        name: tutor.name,
        role: 'client',
        csrfToken,
      };
      sessionStorage.setItem('session', JSON.stringify(session));
      return { ok: true, session };
    }
    return { ok: false, error: error.message };
  }
  const user = data.user;
  // Try to resolve role via RPC fallback (roles table), then app_metadata
  let resolvedRole: string | undefined;
  try {
    const { data: rpcData } = await supabase.rpc('get_my_role');
    resolvedRole = (rpcData as any) || (user?.app_metadata as any)?.role;
  } catch {
    resolvedRole = (user?.app_metadata as any)?.role;
  }
  if (resolvedRole !== 'client') {
    await supabase.auth.signOut();
    return { ok: false, error: 'Acesso negado: usuário não é CLIENTE.' };
  }
  const csrfToken = sessionStorage.getItem('csrfToken') || '';
  const session: UserSession = {
    userId: user.id,
    email: user.email || email,
    name: (user.user_metadata as any)?.name || tutors.find(t => t.email === email)?.name || 'Cliente',
    role: 'client',
    csrfToken,
  };
  sessionStorage.setItem('session', JSON.stringify(session));
  // Ensure the tutor row exists with id = auth.uid() to align with RLS policies
  try {
    await db.upsertTutor({
      id: session.userId,
      name: session.name || 'Cliente',
      email: session.email,
      phone: tutors.find(t => t.email === email)?.phone || '',
    } as any);
  } catch (e) {
    console.warn('Falha ao sincronizar tutor no Supabase:', e);
  }
  return { ok: true, session };
};

export const logout = async () => {
  sessionStorage.removeItem('session');
  await supabase.auth.signOut();
};
