import { supabase } from './supabaseClient';
import { Appointment, PaymentTransaction, Pet, Service, Tutor } from '../types';

// Helpers to map local types to DB tables

export const db = {
  // Tutors
  async upsertTutor(tutor: Tutor) {
    return await supabase.from('tutors').upsert({
      id: tutor.id,
      name: tutor.name,
      email: tutor.email,
      phone: tutor.phone,
    });
  },
  async getTutorByEmail(email: string) {
    return await supabase.from('tutors').select('*').eq('email', email).single();
  },

  // Pets
  async insertPet(pet: Pet) {
    return await supabase.from('pets').insert({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      birth_date: pet.birthDate,
      tutor_id: pet.tutorId,
      photo_url: pet.photoUrl,
      notes: pet.notes,
    });
  },
  async listPetsByTutor(tutorId: string) {
    return await supabase.from('pets').select('*').eq('tutor_id', tutorId);
  },

  // Services
  async listServices() {
    return await supabase.from('services').select('*');
  },
  async insertService(service: Service) {
    return await supabase.from('services').insert({
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      image_url: service.imageUrl,
    });
  },

  // Appointments
  async insertAppointment(app: Appointment) {
    return await supabase.from('appointments').insert({
      id: app.id,
      pet_id: app.petId,
      tutor_id: app.tutorId,
      service_id: app.serviceId,
      date_time: app.dateTime,
      status: app.status,
      notes: app.notes,
      created_at: app.createdAt,
      updated_at: app.updatedAt,
    });
  },
  async listAppointmentsByTutor(tutorId: string) {
    return await supabase.from('appointments').select('*').eq('tutor_id', tutorId);
  },

  // Transactions
  async insertTransaction(tx: PaymentTransaction) {
    return await supabase.from('transactions').insert({
      reference_id: tx.referenceId,
      user_id: tx.userId,
      type: tx.type,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      metadata: tx.metadata,
      created_at: tx.createdAt,
      updated_at: tx.updatedAt,
    });
  },
  async listTransactionsByUser(userId: string) {
    return await supabase.from('transactions').select('*').eq('user_id', userId);
  },
};