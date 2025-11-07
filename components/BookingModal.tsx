import React, { useState } from 'react';
import { Service, Tutor, Pet, Appointment, PetSpecies, AppointmentStatus } from '../types';

interface BookingModalProps {
  service: Service;
  onClose: () => void;
  onBook: (service: Service, newTutor: Tutor, newPet: Pet, newAppointment: Appointment) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ service, onClose, onBook }) => {
  const [tutorName, setTutorName] = useState('');
  const [tutorEmail, setTutorEmail] = useState('');
  const [petName, setPetName] = useState('');
  const [petBreed, setPetBreed] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorName || !tutorEmail || !petName || !petBreed || !dateTime) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    // Generate mock IDs
    const timestamp = Date.now();
    const newTutorId = `tutor-${timestamp}`;
    const newPetId = `pet-${timestamp}`;
    const newAppointmentId = `app-${timestamp}`;
    const nowIso = new Date().toISOString();
    const appointmentIso = new Date(dateTime).toISOString();

    const newTutor: Tutor = {
      id: newTutorId,
      name: tutorName,
      email: tutorEmail,
      phone: 'N/A', // Not collected in this form
    };

    const newPet: Pet = {
      id: newPetId,
      name: petName,
      species: PetSpecies.DOG, // Assume dog for simplicity
      breed: petBreed,
      tutorId: newTutorId,
    };
    
    const newAppointment: Appointment = {
      id: newAppointmentId,
      petId: newPetId,
      tutorId: newTutorId,
      serviceId: service.id,
      dateTime: appointmentIso,
      status: AppointmentStatus.PENDING,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    onBook(service, newTutor, newPet, newAppointment);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Agendar Serviço</h2>
        <p className="text-lg text-sky-600 font-semibold mb-6">{service.name}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
                <label htmlFor="tutorName" className="block text-sm font-medium text-slate-700">Seu Nome</label>
                <input type="text" id="tutorName" value={tutorName} onChange={e => setTutorName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" required />
            </div>
            <div>
                <label htmlFor="tutorEmail" className="block text-sm font-medium text-slate-700">Seu E-mail</label>
                <input type="email" id="tutorEmail" value={tutorEmail} onChange={e => setTutorEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" required />
            </div>
             <div>
                <label htmlFor="petName" className="block text-sm font-medium text-slate-700">Nome do Pet</label>
                <input type="text" id="petName" value={petName} onChange={e => setPetName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" required />
            </div>
            <div>
                <label htmlFor="petBreed" className="block text-sm font-medium text-slate-700">Raça do Pet</label>
                <input type="text" id="petBreed" value={petBreed} onChange={e => setPetBreed(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" required />
            </div>
            <div>
                <label htmlFor="dateTime" className="block text-sm font-medium text-slate-700">Data e Hora</label>
                <input type="datetime-local" id="dateTime" value={dateTime} onChange={e => setDateTime(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500" required />
            </div>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors mr-3">
                    Cancelar
                </button>
                 <button type="submit" className="bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors">
                    Confirmar Agendamento
                </button>
            </div>
        </form>
      </div>
       <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
    `}</style>
    </div>
  );
};

export default BookingModal;
