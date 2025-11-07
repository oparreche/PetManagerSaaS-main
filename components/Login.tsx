import React, { useState } from 'react';

interface LoginProps {
  onAdminLogin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  onClientLogin: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
}

const sanitize = (value: string) => value.replace(/[<>"'`]/g, '');

const Login: React.FC<LoginProps> = ({ onAdminLogin, onClientLogin }) => {
  const [tab, setTab] = useState<'admin' | 'client'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email || !password) return 'Por favor, preencha todos os campos.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Informe um e-mail válido.';
    if (password.length < 6) return 'A senha deve ter ao menos 6 caracteres.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    const safeEmail = sanitize(email);
    const safePassword = sanitize(password);
    const result = tab === 'admin' 
      ? await onAdminLogin(safeEmail, safePassword)
      : await onClientLogin(safeEmail, safePassword);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Falha ao autenticar.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800 text-center">Entrar</h1>
          <p className="text-sm text-slate-500 text-center mt-1">Selecione o tipo de acesso</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button 
              onClick={() => setTab('admin')} 
              className={`py-2 rounded-lg font-semibold ${tab === 'admin' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              aria-selected={tab === 'admin'}
            >
              Administrador
            </button>
            <button 
              onClick={() => setTab('client')} 
              className={`py-2 rounded-lg font-semibold ${tab === 'client' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              aria-selected={tab === 'client'}
            >
              Cliente
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">E-mail</label>
            <input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Senha</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
              autoComplete="current-password"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold ${loading ? 'bg-slate-300 text-slate-600' : 'bg-sky-600 text-white hover:bg-sky-700'}`}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <p className="text-xs text-slate-500 text-center">
            Proteção CSRF e XSS aplicadas. Nunca compartilhe sua senha.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;