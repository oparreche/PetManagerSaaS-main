import React, { useEffect, useMemo, useState } from 'react';
import { Appointment, AppointmentStatus, Service, UserSession } from '../types';
import { services as allServices } from '../services/mockData';
import { db } from '../services/db';
import { listTransactions as listLocalTransactions } from '../services/transactionService';

interface ClientDashboardProps {
  appointments: Appointment[];
  session: UserSession | null;
}

const formatCurrencyBRL = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const ClientDashboard: React.FC<ClientDashboardProps> = ({ appointments, session }) => {
  const [remoteAppointments, setRemoteAppointments] = useState<Appointment[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!session) return;
      const { data: apps, error: appsErr } = await db.listAppointmentsByTutor(session.userId);
      if (!appsErr && apps) {
        // map DB rows to Appointment shape if needed
        const mapped = apps.map((row: any) => ({
          id: row.id,
          petId: row.pet_id,
          tutorId: row.tutor_id,
          serviceId: row.service_id,
          dateTime: row.date_time,
          status: row.status,
          notes: row.notes || undefined,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        })) as Appointment[];
        setRemoteAppointments(mapped);
      }
      const { data: txs, error: txErr } = await db.listTransactionsByUser(session.userId);
      if (!txErr && txs) {
        setTransactions(txs);
      } else {
        // fallback to local storage
        const local = listLocalTransactions().filter(tx => tx.userId === session.userId);
        setTransactions(local);
      }
    };
    load();
  }, [session]);

  const myAppointments = useMemo(() => {
    if (!session) return [];
    const source = remoteAppointments.length ? remoteAppointments : appointments;
    return source
      .filter(a => a.tutorId === session.userId)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [appointments, remoteAppointments, session]);

  const currentPlan = useMemo(() => {
    // Last subscription transaction from this user
    return transactions.find((tx: any) => (tx.type || tx.type) === 'subscription');
  }, [transactions]);

  const getServiceName = (serviceId: string) => {
    const s: Service | undefined = allServices.find(sv => sv.id === serviceId);
    return s?.name || 'Serviço';
  };

  return (
    <div className="space-y-8">
      {/* Botão para ir para a Landing Page */}
      <div className="flex justify-end">
        <button
          className="px-4 py-2 rounded-md bg-slate-200 text-slate-800 hover:bg-slate-300"
          onClick={() => {
            // Redireciona para a página pública inicial
            window.location.href = '/';
          }}
        >
          Ir para a Landing Page
        </button>
      </div>
      {/* Assinatura atual */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Minha Assinatura</h2>
        {currentPlan ? (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-slate-700"><span className="font-medium">Plano:</span> {String(currentPlan.metadata?.planId || 'Indefinido')}</p>
              <p className="text-slate-700"><span className="font-medium">Status:</span> {currentPlan.status}</p>
              <p className="text-slate-700"><span className="font-medium">Desde:</span> {new Date(currentPlan.createdAt).toLocaleString('pt-BR')}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <p className="text-slate-700"><span className="font-medium">Valor:</span> {formatCurrencyBRL(currentPlan.amount)}</p>
            </div>
          </div>
        ) : (
          <p className="text-slate-600">Você ainda não possui uma assinatura ativa.</p>
        )}
      </section>

      {/* Pagamentos */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pagamentos</h2>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2 pr-4">Data</th>
                  <th className="py-2 pr-4">Tipo</th>
                  <th className="py-2 pr-4">Referência</th>
                  <th className="py-2 pr-4">Valor</th>
                  <th className="py-2 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 8).map((tx: any) => (
                  <tr key={tx.id} className="border-b border-slate-100">
                    <td className="py-2 pr-4">{new Date(tx.created_at || tx.createdAt).toLocaleString('pt-BR')}</td>
                    <td className="py-2 pr-4">{(tx.type || tx.type) === 'subscription' ? 'Assinatura' : 'Pagamento Único'}</td>
                    <td className="py-2 pr-4 text-slate-500">{tx.reference_id || tx.referenceId || '-'}</td>
                    <td className="py-2 pr-4">{formatCurrencyBRL(Number(tx.amount))}</td>
                    <td className="py-2 pr-4">{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-600">Nenhum pagamento registrado ainda.</p>
        )}
      </section>

      {/* Meus Agendamentos */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Meus Agendamentos</h2>
        {myAppointments.length > 0 ? (
          <ul className="divide-y divide-slate-200">
            {myAppointments.map(app => (
              <li key={app.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{getServiceName(app.serviceId)}</p>
                  <p className="text-slate-600 text-sm">{new Date(app.dateTime).toLocaleString('pt-BR')}</p>
                </div>
                <span className={`text-sm px-2 py-1 rounded ${
                  app.status === AppointmentStatus.SCHEDULED ? 'bg-blue-100 text-blue-700' :
                  app.status === AppointmentStatus.COMPLETED ? 'bg-green-100 text-green-700' :
                  app.status === AppointmentStatus.CANCELED ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {app.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-600">Você ainda não possui agendamentos.</p>
        )}
      </section>
    </div>
  );
};

export default ClientDashboard;
