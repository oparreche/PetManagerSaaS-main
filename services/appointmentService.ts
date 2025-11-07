import { Appointment, AppointmentStatus } from '../types';
import { appointments as seedAppointments } from './mockData';

let appointmentStore: Appointment[] = seedAppointments.map(appointment => ({ ...appointment }));

const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

export const listAppointments = async (): Promise<Appointment[]> => clone(appointmentStore);

export const getAppointmentById = async (id: string): Promise<Appointment | null> => {
  const appointment = appointmentStore.find(item => item.id === id);
  return appointment ? clone(appointment) : null;
};

export const getAppointmentsByTutorId = async (tutorId: string): Promise<Appointment[]> =>
  clone(appointmentStore.filter(item => item.tutorId === tutorId));

export const getAppointmentsByPetId = async (petId: string): Promise<Appointment[]> =>
  clone(appointmentStore.filter(item => item.petId === petId));

export const getAppointmentsByStatus = async (status: AppointmentStatus): Promise<Appointment[]> =>
  clone(appointmentStore.filter(item => item.status === status));

export const getAppointmentsByDate = async (date: string): Promise<Appointment[]> =>
  clone(
    appointmentStore.filter(item => {
      const appointmentDate = new Date(item.dateTime).toISOString().split('T')[0];
      return appointmentDate === date;
    })
  );

export const createAppointment = async (
  appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Appointment> => {
  const now = new Date().toISOString();
  const newAppointment: Appointment = {
    ...appointment,
    id: `app-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };

  appointmentStore = [...appointmentStore, newAppointment];
  return clone(newAppointment);
};

export const updateAppointment = async (
  id: string,
  updates: Partial<Omit<Appointment, 'id'>>
): Promise<Appointment> => {
  const index = appointmentStore.findIndex(item => item.id === id);

  if (index === -1) {
    throw new Error('Agendamento não encontrado');
  }

  const updatedAppointment: Appointment = {
    ...appointmentStore[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  appointmentStore = [
    ...appointmentStore.slice(0, index),
    updatedAppointment,
    ...appointmentStore.slice(index + 1),
  ];

  return clone(updatedAppointment);
};

export const removeAppointment = async (id: string): Promise<void> => {
  appointmentStore = appointmentStore.filter(item => item.id !== id);
};

export const resetAppointments = (): void => {
  appointmentStore = seedAppointments.map(appointment => ({ ...appointment }));
};
