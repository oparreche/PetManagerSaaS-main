import { Appointment, AppointmentStatus, Pet, PetSpecies, Service, Tutor } from '../types';
import hidratacaoImage from '../components/assets/Gemini_Generated_Image_bo6jjqbo6jjqbo6j.png';
import banhoTosaImage from '../components/assets/Gemini_Generated_Image_p0tfr6p0tfr6p0tf.png';
import tosaRacaImage from '../components/assets/Gemini_Generated_Image_qy3i6qqy3i6qqy3i.png';
import banhoMedicamentosoImage from '../components/assets/Gemini_Generated_Image_sszbqpsszbqpsszb.png';

export const services: Service[] = [
  {
    id: 'service-1',
    name: 'Banho & Tosa Higiênica',
    description: 'Um banho refrescante com produtos de alta qualidade, seguido de uma tosa higiênica para o conforto do seu pet.',
    price: 80,
    duration: 60,
    imageUrl: banhoTosaImage,
  },
  {
    id: 'service-2',
    name: 'Tosa da Raça',
    description: 'Tosa especializada que segue os padrões estéticos da raça do seu pet, realçando sua beleza natural.',
    price: 120,
    duration: 90,
    imageUrl: tosaRacaImage,
  },
  {
    id: 'service-3',
    name: 'Banho Medicamentoso',
    description: 'Tratamento terapêutico com produtos específicos para problemas de pele e pelagem, sob orientação.',
    price: 100,
    duration: 75,
    imageUrl: banhoMedicamentosoImage,
  },
  {
    id: 'service-4',
    name: 'Hidratação de Pelos',
    description: 'Tratamento intensivo para restaurar o brilho, maciez e saúde da pelagem do seu companheiro.',
    price: 60,
    duration: 45,
    imageUrl: hidratacaoImage,
  },
];

export const tutors: Tutor[] = [
  {
    id: 'tutor-1',
    name: 'Carlos Silva',
    email: 'carlos.silva@example.com',
    phone: '(11) 98765-4321',
  },
  {
    id: 'tutor-2',
    name: 'Mariana Costa',
    email: 'mariana.costa@example.com',
    phone: '(21) 91234-5678',
  },
];

export const pets: Pet[] = [
  {
    id: 'pet-1',
    name: 'Thor',
    species: PetSpecies.DOG,
    breed: 'Golden Retriever',
    birthDate: '2021-05-10',
    tutorId: 'tutor-1',
    photoUrl: 'https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'pet-2',
    name: 'Mia',
    species: PetSpecies.CAT,
    breed: 'Siamês',
    birthDate: '2022-01-15',
    tutorId: 'tutor-2',
  },
  {
    id: 'pet-3',
    name: 'Loki',
    species: PetSpecies.DOG,
    breed: 'Vira-lata',
    birthDate: '2020-11-20',
    tutorId: 'tutor-1',
  },
];

const today = new Date();
const setTime = (date: Date, hours: number, minutes: number) => {
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate.toISOString();
};

export const appointments: Appointment[] = [
  {
    id: 'app-1',
    petId: 'pet-1',
    tutorId: 'tutor-1',
    serviceId: 'service-1',
    dateTime: setTime(today, 9, 30),
    status: AppointmentStatus.SCHEDULED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-2',
    petId: 'pet-2',
    tutorId: 'tutor-2',
    serviceId: 'service-3',
    dateTime: setTime(today, 11, 0),
    status: AppointmentStatus.IN_PROGRESS,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-3',
    petId: 'pet-3',
    tutorId: 'tutor-1',
    serviceId: 'service-2',
    dateTime: setTime(today, 14, 0),
    status: AppointmentStatus.SCHEDULED,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
