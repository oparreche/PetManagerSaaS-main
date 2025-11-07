import { Booking, BookingStatus, Service, TimeSlot } from '../types';
import { services as seedServices } from './mockData';

let bookingStore: Booking[] = [];

const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

const generateTimeSlots = (): string[] => {
  const slots: string[] = [];

  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const hoursLabel = hour.toString().padStart(2, '0');
      const minutesLabel = minute.toString().padStart(2, '0');
      slots.push(`${hoursLabel}:${minutesLabel}`);
    }
  }

  return slots;
};

export const getServices = async (): Promise<Service[]> => clone(seedServices);

export const getAvailableTimeSlots = async (dateIso: string): Promise<TimeSlot[]> => {
  const requestedDate = new Date(dateIso).toISOString().split('T')[0];
  const bookingsForDay = bookingStore.filter(booking => booking.date === requestedDate);
  const bookedTimes = new Set(bookingsForDay.map(booking => booking.time));

  return generateTimeSlots().map(time => ({
    time,
    available: !bookedTimes.has(time),
  }));
};

export const createBooking = async (
  booking: Omit<Booking, 'id' | 'status' | 'createdAt'>
): Promise<Booking> => {
  const now = new Date().toISOString();
  const newBooking: Booking = {
    ...booking,
    id: `booking-${Date.now()}`,
    status: 'pending',
    createdAt: now,
  };

  bookingStore = [...bookingStore, newBooking];
  return clone(newBooking);
};

export const getBookingsByDate = async (dateIso: string): Promise<Booking[]> => {
  const normalizedDate = new Date(dateIso).toISOString().split('T')[0];
  return clone(bookingStore.filter(booking => booking.date === normalizedDate));
};

export const updateBookingStatus = async (
  id: string,
  status: BookingStatus
): Promise<Booking> => {
  const index = bookingStore.findIndex(booking => booking.id === id);

  if (index === -1) {
    throw new Error('Agendamento não encontrado');
  }

  const updatedBooking: Booking = {
    ...bookingStore[index],
    status,
  };

  bookingStore = [
    ...bookingStore.slice(0, index),
    updatedBooking,
    ...bookingStore.slice(index + 1),
  ];

  return clone(updatedBooking);
};

export const rescheduleBooking = async (
  id: string,
  options: { date: string; time: string }
): Promise<Booking> => {
  const index = bookingStore.findIndex(booking => booking.id === id);

  if (index === -1) {
    throw new Error('Agendamento não encontrado');
  }

  const updatedBooking: Booking = {
    ...bookingStore[index],
    date: options.date,
    time: options.time,
    status: 'pending',
  };

  bookingStore = [
    ...bookingStore.slice(0, index),
    updatedBooking,
    ...bookingStore.slice(index + 1),
  ];

  return clone(updatedBooking);
};

export const removeBooking = async (id: string): Promise<void> => {
  bookingStore = bookingStore.filter(booking => booking.id !== id);
};

export const resetBookings = (): void => {
  bookingStore = [];
};
