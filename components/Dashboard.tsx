import React from 'react';
import Card from './ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { services } from '../services/mockData';
import { Appointment, AppointmentStatus } from '../types';

interface DashboardProps {
    appointments: Appointment[];
}

const Dashboard: React.FC<DashboardProps> = ({ appointments }) => {

  const serviceCount = appointments.reduce((acc, appointment) => {
    const serviceName = services.find(s => s.id === appointment.serviceId)?.name || 'Unknown';
    acc[serviceName] = (acc[serviceName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(serviceCount).map(key => ({
    name: key,
    'Serviços': serviceCount[key],
  }));

  const totalRevenue = appointments.reduce((sum, app) => {
     const service = services.find(s => s.id === app.serviceId);
     return sum + (service ? service.price : 0);
  }, 0);

  const todayAppointments = appointments.filter(app => {
    const today = new Date();
    const appDate = new Date(app.dateTime);
    return appDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments.filter(app => new Date(app.dateTime) > new Date());
  const completedAppointments = appointments.filter(app => app.status === AppointmentStatus.COMPLETED);
  const inProgressAppointments = appointments.filter(app => app.status === AppointmentStatus.IN_PROGRESS);

  const kpis = [
    { title: 'Receita do Mês', value: `R$ ${totalRevenue.toFixed(2)}`, change: '+12%', changeType: 'increase' },
    { title: 'Serviços Realizados', value: appointments.length, change: '+5%', changeType: 'increase' },
    { title: 'Ticket Médio', value: `R$ ${(totalRevenue / (appointments.length || 1)).toFixed(2)}`, change: '-2%', changeType: 'decrease' },
    { title: 'Clientes Ativos', value: '78', change: '+3', changeType: 'increase' },
  ];

  const additionalKpis = [
    { title: 'Agendamentos de Hoje', value: todayAppointments.length, change: '+8%', changeType: 'increase' },
    { title: 'Próximos Agendamentos', value: upcomingAppointments.length, change: '+15%', changeType: 'increase' },
    { title: 'Concluídos', value: completedAppointments.length, change: '+10%', changeType: 'increase' },
    { title: 'Em Andamento', value: inProgressAppointments.length, change: '0%', changeType: 'neutral' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards - First Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-slate-500">{kpi.title}</h3>
              <p className="text-3xl font-bold text-slate-800 mt-2">{kpi.value}</p>
              <div className="flex items-center text-sm mt-2">
                <span className={`${kpi.changeType === 'increase' ? 'text-green-500' : kpi.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'} font-semibold`}>
                  {kpi.change}
                </span>
                <span className="text-slate-500 ml-1">vs. mês anterior</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* KPI Cards - Second Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {additionalKpis.map((kpi, index) => (
          <Card key={index}>
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-slate-500">{kpi.title}</h3>
              <p className="text-3xl font-bold text-slate-800 mt-2">{kpi.value}</p>
              <div className="flex items-center text-sm mt-2">
                <span className={`${kpi.changeType === 'increase' ? 'text-green-500' : kpi.changeType === 'decrease' ? 'text-red-500' : 'text-gray-500'} font-semibold`}>
                  {kpi.change}
                </span>
                <span className="text-slate-500 ml-1">vs. mês anterior</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
         <Card className="lg:col-span-3">
             <h3 className="text-lg font-semibold text-slate-700 mb-4">Serviços Mais Vendidos</h3>
             <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}/>
                    <Legend wrapperStyle={{fontSize: "14px"}}/>
                    <Bar dataKey="Serviços" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
        <Card className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">Próximos Agendamentos</h3>
            <ul className="space-y-3">
                {appointments.slice(0, 5).map(app => {
                    const service = services.find(s => s.id === app.serviceId);
                    return (
                        <li key={app.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100">
                            <div>
                                <p className="font-semibold text-slate-800">{service?.name}</p>
                                <p className="text-sm text-slate-500">{new Date(app.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <span className="text-sm font-medium text-sky-600">Pet A</span>
                        </li>
                    )
                })}
            </ul>
        </Card>
      </div>

      {/* Service Utilization */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Utilização dos Serviços</h3>
        <div className="space-y-4">
          {services.map((service) => {
            const serviceAppointments = appointments.filter(a => a.serviceId === service.id);
            const utilization = appointments.length > 0 
              ? (serviceAppointments.length / appointments.length) * 100 
              : 0;
            
            return (
              <div key={service.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                    <span className="text-sky-600 font-semibold text-sm">{service.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{service.name}</p>
                    <p className="text-xs text-slate-500">{service.duration} min • R$ {service.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-sky-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${utilization}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700 w-12 text-right">{serviceAppointments.length}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
};

export default Dashboard;
