export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
}

export enum PetSpecies {
  DOG = 'dog',
  CAT = 'cat',
}

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  birthDate?: string;
  tutorId: string;
  photoUrl?: string;
  notes?: string;
}

export interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  PENDING = 'pending',
  PAID = 'paid',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export interface Appointment {
  id: string;
  petId: string;
  tutorId: string;
  serviceId: string;
  dateTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'canceled';

export interface Booking {
  id: string;
  clientId: string;
  petId: string;
  serviceId: string;
  date: string;
  time: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export type UserRole = 'admin' | 'client';

export interface UserSession {
  userId: string;
  email: string;
  name?: string;
  role: UserRole;
  csrfToken: string;
}

export type PaymentStatus = 'pending' | 'succeeded' | 'failed';

export interface PaymentTransaction {
  id: string;
  referenceId?: string; // gateway reference
  userId: string;
  type: 'one_time' | 'subscription';
  amount: number;
  currency: string; // e.g., BRL
  status: PaymentStatus;
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, string | number | boolean>;
}
