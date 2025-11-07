import React from 'react';
import { useNavigate } from 'react-router-dom';

const Completion: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-xl p-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">Finalização</h1>
        <p className="text-slate-600 mb-4">Seu pagamento foi concluído. Obrigado por usar o PetManager!</p>

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

export default Completion;

