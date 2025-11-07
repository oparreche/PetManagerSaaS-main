import React, { useState } from 'react';
import Card from './ui/Card';
import DogIcon from './icons/DogIcon';
import CatIcon from './icons/CatIcon';
import PlusIcon from './icons/PlusIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { Pet, PetSpecies, Tutor } from '../types';

const PetIcon: React.FC<{ species: PetSpecies }> = ({ species }) => {
    switch (species) {
        case PetSpecies.DOG:
            return <DogIcon className="w-5 h-5 text-slate-500" />;
        case PetSpecies.CAT:
            return <CatIcon className="w-5 h-5 text-slate-500" />;
        default:
            return <DogIcon className="w-5 h-5 text-slate-500" />;
    }
};

const speciesLabels: Record<PetSpecies, string> = {
    [PetSpecies.DOG]: 'Cachorro',
    [PetSpecies.CAT]: 'Gato',
};

const TutorCard: React.FC<{ tutor: Tutor, pets: Pet[] }> = ({ tutor, pets }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <Card className="mb-4">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-xl mr-4">
                        {tutor.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-lg text-slate-800">{tutor.name}</p>
                        <p className="text-sm text-slate-500">{tutor.email}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <span className="text-sm text-slate-500 mr-2">{pets.length} pet(s)</span>
                    <ChevronDownIcon className={`w-6 h-6 text-slate-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isOpen && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-600 mb-2">Pets</h4>
                    <ul className="space-y-2">
                        {pets.map(pet => (
                            <li key={pet.id} className="flex items-center p-2 rounded-md bg-slate-50">
                                <PetIcon species={pet.species} />
                                <div className="ml-3">
                                    <p className="font-semibold text-slate-700">{pet.name}</p>
                                    <p className="text-xs text-slate-500">{pet.breed} - {speciesLabels[pet.species]}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </Card>
    )
}

interface ClientsViewProps {
    tutors: Tutor[];
    pets: Pet[];
}

const ClientsView: React.FC<ClientsViewProps> = ({ tutors, pets }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTutors = tutors.filter(tutor => 
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tutor.email && tutor.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  return (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-auto sm:flex-grow max-w-lg">
                 <input
                    type="text"
                    placeholder="Buscar por nome ou e-mail..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>
            <button className="w-full sm:w-auto flex items-center justify-center bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors">
                <PlusIcon className="w-5 h-5 mr-2" />
                Adicionar Cliente
            </button>
        </div>
        <div>
            {filteredTutors.map(tutor => {
                const tutorPets = pets.filter(pet => pet.tutorId === tutor.id);
                return <TutorCard key={tutor.id} tutor={tutor} pets={tutorPets} />
            })}
        </div>
    </div>
  );
};

export default ClientsView;
