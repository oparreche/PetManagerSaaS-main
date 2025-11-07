import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentReturn: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);

  const event = params.get('event') || 'billing.paid';
  const status = params.get('status') || 'PAID';
  const referenceId = params.get('referenceId') || params.get('id') || params.get('billingId');
  const amount = params.get('amount');

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-xl p-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">Retorno do Pagamento</h1>
        <p className="text-slate-600 mb-4">Obrigado! Seu pagamento foi processado.</p>

        <div className="space-y-2 text-sm text-slate-700">
          <p><span className="font-medium">Evento:</span> {event}</p>
          <p><span className="font-medium">Status:</span> {status}</p>
          {referenceId && <p><span className="font-medium">Referência:</span> {referenceId}</p>}
          {amount && <p><span className="font-medium">Valor:</span> R$ {(Number(amount) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '').trim()}</p>}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700"
            onClick={() => navigate('/')}
          >
            Ir para a Página Inicial
          </button>
          <button
            className="px-4 py-2 rounded-md bg-slate-200 text-slate-800 hover:bg-slate-300"
            onClick={() => navigate('/client')}
          >
            Ir para o Dashboard do Cliente
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn;

