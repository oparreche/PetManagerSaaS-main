import React from 'react';
import { services } from '../services/mockData';
import { Appointment, AppointmentStatus, Pet, Tutor } from '../types';
import Card from './ui/Card';
import DogIcon from './icons/DogIcon';

interface ScheduleViewProps {
    appointments: Appointment[];
    pets: Pet[];
    tutors: Tutor[];
}

const statusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]: 'Agendado',
  [AppointmentStatus.IN_PROGRESS]: 'Em Andamento',
  [AppointmentStatus.COMPLETED]: 'Concluído',
  [AppointmentStatus.CANCELED]: 'Cancelado',
};

const ScheduleView: React.FC<ScheduleViewProps> = ({ appointments, pets, tutors }) => {
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-800';
      case AppointmentStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800';
      case AppointmentStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case AppointmentStatus.CANCELED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
    const pet = pets.find(p => p.id === appointment.petId);
    const service = services.find(s => s.id === appointment.serviceId);
    const tutor = tutors.find(t => t.id === pet?.tutorId);

    if (!pet || !service || !tutor) return null;

    return (
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-3 sm:mb-0">
            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mr-4">
               {pet.photoUrl ? <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover rounded-full" /> : <DogIcon className="w-7 h-7 text-slate-500" />}
            </div>
            <div>
              <p className="font-bold text-lg text-slate-800">{pet.name}</p>
              <p className="text-sm text-slate-500">{tutor.name}</p>
            </div>
          </div>
          <div className="flex-grow mx-4 text-center sm:text-left">
            <p className="font-semibold text-slate-700">{service.name}</p>
            <p className="text-sm text-slate-500">{new Date(appointment.dateTime).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
          </div>
          <div className="flex items-center justify-between sm:justify-end mt-3 sm:mt-0">
             <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
              {statusLabels[appointment.status]}
            </span>
          </div>
        </div>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
       <div>
         <h2 className="text-xl font-bold text-slate-700 mb-4">Serviços do Dia</h2>
         {appointments.length === 0 ? (
            <Card>
                <p className="text-center text-slate-500">Nenhum agendamento para hoje.</p>
            </Card>
         ) : (
            [...appointments]
                .sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
                .map(app => <AppointmentCard key={app.id} appointment={app} />)
         )}
       </div>
    </div>
  );
};

export default ScheduleView;
