import React, { useMemo, useState } from 'react';
import Card from './ui/Card';
import DogIcon from './icons/DogIcon';
import CatIcon from './icons/CatIcon';
import { Pet, PetSpecies, Tutor } from '../types';

type FilterOption = 'all' | PetSpecies;

interface PetManagementProps {
  pets: Pet[];
  tutors: Tutor[];
}

const speciesLabels: Record<PetSpecies, string> = {
  [PetSpecies.DOG]: 'Cachorro',
  [PetSpecies.CAT]: 'Gato',
};

const speciesIcon = (species: PetSpecies) => {
  switch (species) {
    case PetSpecies.CAT:
      return <CatIcon className="w-5 h-5 text-slate-500" />;
    case PetSpecies.DOG:
    default:
      return <DogIcon className="w-5 h-5 text-slate-500" />;
  }
};

const PetManagement: React.FC<PetManagementProps> = ({ pets, tutors }) => {
  const [filter, setFilter] = useState<FilterOption>('all');

  const tutorMap = useMemo(
    () =>
      tutors.reduce<Record<string, Tutor>>((acc, tutor) => {
        acc[tutor.id] = tutor;
        return acc;
      }, {}),
    [tutors]
  );

  const filteredPets = useMemo(() => {
    if (filter === 'all') {
      return pets;
    }

    return pets.filter(pet => pet.species === filter);
  }, [pets, filter]);

  return (
    <div className="space-y-6">
      <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Gestão de Pets</h2>
          <p className="text-sm text-slate-500">
            Visualize rapidamente os pets cadastrados e seus respectivos tutores.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-sky-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          {Object.values(PetSpecies).map(species => (
            <button
              key={species}
              type="button"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                filter === species
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              onClick={() => setFilter(species)}
            >
              {speciesIcon(species)}
              <span>{speciesLabels[species]}</span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPets.map(pet => {
          const tutor = tutorMap[pet.tutorId];

          return (
            <Card key={pet.id} className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                {pet.photoUrl ? (
                  <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" />
                ) : (
                  speciesIcon(pet.species)
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-800">{pet.name}</h3>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-sky-100 text-sky-700">
                    {speciesLabels[pet.species]}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  {pet.breed} {pet.birthDate ? `• Nascido em ${pet.birthDate}` : ''}
                </p>
                {pet.notes && (
                  <p className="text-sm text-slate-500 mt-2">Observações: {pet.notes}</p>
                )}
              </div>
              {tutor && (
                <div className="text-sm text-slate-500">
                  <p className="font-semibold text-slate-700">Tutor</p>
                  <p>{tutor.name}</p>
                  <p>{tutor.phone}</p>
                  <p>{tutor.email}</p>
                </div>
              )}
            </Card>
          );
        })}

        {filteredPets.length === 0 && (
          <Card>
            <p className="text-center text-slate-500">Nenhum pet encontrado para este filtro.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PetManagement;
