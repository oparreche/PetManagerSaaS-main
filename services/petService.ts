import { Pet, PetSpecies } from '../types';
import { pets as seedPets } from './mockData';

let petStore: Pet[] = seedPets.map(pet => ({ ...pet }));

const clone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

export const listPets = async (): Promise<Pet[]> => clone(petStore);

export const getPetById = async (id: string): Promise<Pet | null> => {
  const pet = petStore.find(item => item.id === id);
  return pet ? clone(pet) : null;
};

export const getPetsByTutorId = async (tutorId: string): Promise<Pet[]> =>
  clone(petStore.filter(item => item.tutorId === tutorId));

export const createPet = async (
  pet: Omit<Pet, 'id'>
): Promise<Pet> => {
  const newPet: Pet = {
    ...pet,
    id: `pet-${Date.now()}`,
    species: pet.species ?? PetSpecies.DOG,
  };

  petStore = [...petStore, newPet];
  return clone(newPet);
};

export const updatePet = async (
  id: string,
  updates: Partial<Omit<Pet, 'id'>>
): Promise<Pet> => {
  const index = petStore.findIndex(item => item.id === id);

  if (index === -1) {
    throw new Error('Pet não encontrado');
  }

  const updatedPet: Pet = {
    ...petStore[index],
    ...updates,
  };

  petStore = [
    ...petStore.slice(0, index),
    updatedPet,
    ...petStore.slice(index + 1),
  ];

  return clone(updatedPet);
};

export const removePet = async (id: string): Promise<void> => {
  petStore = petStore.filter(item => item.id !== id);
};

export const resetPets = (): void => {
  petStore = seedPets.map(pet => ({ ...pet }));
};
