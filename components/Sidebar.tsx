import React, { useState } from 'react';
import DashboardIcon from './icons/DashboardIcon';
import CalendarIcon from './icons/CalendarIcon';
import UsersIcon from './icons/UsersIcon';
import DogIcon from './icons/DogIcon';
import GlobeIcon from './icons/GlobeIcon';
import PawIcon from './icons/PawIcon';

type View = 'dashboard' | 'schedule' | 'clients' | 'petmanagement';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  switchToPublicView: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, switchToPublicView }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'schedule', label: 'Agenda', icon: <CalendarIcon /> },
    { id: 'clients', label: 'Clientes', icon: <UsersIcon /> },
    { id: 'petmanagement', label: 'Gestão de Pets', icon: <PawIcon /> },
  ];

  const NavLink: React.FC<{ id: View; label: string; icon: React.ReactNode; isAction?: boolean; action?: () => void }> = ({ id, label, icon, isAction = false, action }) => (
    <li key={id}>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (isAction && action) {
              action();
          } else {
              setCurrentView(id);
          }
          setIsSidebarOpen(false);
        }}
        className={`flex items-center p-3 rounded-lg text-slate-200 hover:bg-sky-600 transition-colors duration-200 ${
          currentView === id && !isAction ? 'bg-sky-700' : ''
        }`}
      >
        <span className="w-6 h-6">{icon}</span>
        <span className="ml-4 font-medium">{label}</span>
      </a>
    </li>
  );
  
  const SidebarContent = () => (
      <>
        <div className="flex items-center mb-10 p-2">
            <DogIcon className="w-10 h-10 text-sky-400"/>
            <span className="text-2xl font-bold ml-3">PetManager</span>
        </div>
        <nav className="flex flex-col flex-grow">
          <ul className="space-y-2 flex-grow">
            {navItems.map(item => <NavLink key={item.id} id={item.id as View} label={item.label} icon={item.icon} />)}
          </ul>
           <div className="mt-auto">
             <NavLink id={'public' as any} label="Ver Página Pública" icon={<GlobeIcon />} isAction={true} action={switchToPublicView} />
           </div>
        </nav>
      </>
  );

  return (
    <>
      {/* Mobile Header with Hamburger Menu */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-slate-900 z-20 flex items-center justify-between p-4 shadow-md">
         <div className="flex items-center text-white">
            <DogIcon className="w-8 h-8 text-sky-400" />
            <span className="text-xl font-bold ml-2">PetManager</span>
         </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-16 6h16"></path></svg>
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-slate-900 text-white p-4">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar (Overlay) */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 text-white p-4 z-40 transform transition-transform lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
