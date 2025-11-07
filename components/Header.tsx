
import React from 'react';
import { UserSession } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface HeaderProps {
  title: string;
  session?: UserSession | null;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, session, onLogout }) => {
  return (
    <header className="bg-white shadow-sm p-4 sm:p-6 flex justify-between items-center mt-16 lg:mt-0 sticky top-16 lg:top-0 z-10">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800">{title}</h1>
      <div className="flex items-center">
        <div className="relative">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://picsum.photos/100/100"
            alt="User avatar"
          />
           <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
        </div>
        <div className="ml-3 hidden sm:block">
          <p className="font-semibold text-slate-700">{session?.name || 'Usuário'}</p>
          <p className="text-sm text-slate-500">{session?.role === 'admin' ? 'Admin' : 'Cliente'}</p>
        </div>
        <button className="ml-2 text-slate-500 hover:text-slate-700" onClick={onLogout} title="Sair">
           <ChevronDownIcon className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
