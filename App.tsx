import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScheduleView from './components/ScheduleView';
import ClientsView from './components/ClientsView';
import PetManagement from './components/PetManagement';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ClientDashboard from './components/ClientDashboard';
import Login from './components/Login.tsx';
import { 
  appointments as initialAppointments, 
  tutors as initialTutors, 
  pets as initialPets 
} from './services/mockData';
import { Appointment, Tutor, Pet, UserSession, AppointmentStatus, PaymentTransaction, Service } from './types';
import { loginAdmin, loginClient, logout } from './services/authService.ts';
import { initAbacateSDK, createOneTimePayment } from './services/abacateService.ts';
import { supabase } from './services/supabaseClient';
import { db } from './services/db';

type View = 'dashboard' | 'schedule' | 'clients' | 'petmanagement';
type AppMode = 'login' | 'admin' | 'client';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [appMode, setAppMode] = useState<AppMode>('login');
  const [session, setSession] = useState<UserSession | null>(null);
  const navigate = useNavigate();

  // Restore session on load to support direct route access
  useEffect(() => {
    const raw = sessionStorage.getItem('session');
    if (raw) {
      try {
        const s = JSON.parse(raw) as UserSession;
        setSession(s);
        setAppMode(s.role === 'admin' ? 'admin' : 'client');
      } catch {}
    }
  }, []);

  // Lift state up to manage data changes
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [tutors, setTutors] = useState<Tutor[]>(initialTutors);
  const [pets, setPets] = useState<Pet[]>(initialPets);

  // Initialize CSRF token and Abacate SDK
  useEffect(() => {
    const existingToken = sessionStorage.getItem('csrfToken');
    if (!existingToken) {
      const token = crypto.getRandomValues(new Uint32Array(4)).join('-');
      sessionStorage.setItem('csrfToken', token);
    }
    initAbacateSDK();
  }, []);

  const handleBookAppointment = async (service: Service, newTutor: Tutor, newPet: Pet, newAppointment: Appointment) => {
    const existingTutor = tutors.find(t => t.email === newTutor.email);
    const nowIso = new Date().toISOString();
    const appointmentDate = new Date(newAppointment.dateTime).toISOString();

    if (existingTutor) {
      const petRecord: Pet = { ...newPet, tutorId: existingTutor.id };
      const appointmentRecord: Appointment = {
        ...newAppointment,
        petId: petRecord.id,
        tutorId: existingTutor.id,
        dateTime: appointmentDate,
        createdAt: newAppointment.createdAt ?? nowIso,
        updatedAt: nowIso,
      };

      setPets(prevPets => [...prevPets, petRecord]);
      setAppointments(prevAppointments => [...prevAppointments, appointmentRecord]);
      // Persist via secure Edge Function to bypass RLS
      (async () => {
        try {
          await supabase.functions.invoke('secure-create-appointment-transaction', {
            body: {
              tutor: existingTutor,
              pet: petRecord,
              appointment: appointmentRecord,
            },
          });
        } catch (e) {
          console.warn('Falha ao salvar agendamento no Supabase (secure fn):', e);
        }
      })();
    } else {
      const tutorRecord: Tutor = { ...newTutor };
      const petRecord: Pet = { ...newPet, tutorId: tutorRecord.id };
      const appointmentRecord: Appointment = {
        ...newAppointment,
        petId: petRecord.id,
        tutorId: tutorRecord.id,
        dateTime: appointmentDate,
        createdAt: newAppointment.createdAt ?? nowIso,
        updatedAt: nowIso,
      };

      setTutors(prevTutors => [...prevTutors, tutorRecord]);
      setPets(prevPets => [...prevPets, petRecord]);
      setAppointments(prevAppointments => [...prevAppointments, appointmentRecord]);
      // Persist via secure Edge Function to bypass RLS
      (async () => {
        try {
          await supabase.functions.invoke('secure-create-appointment-transaction', {
            body: {
              tutor: tutorRecord,
              pet: petRecord,
              appointment: appointmentRecord,
            },
          });
        } catch (e) {
          console.warn('Falha ao salvar agendamento no Supabase (secure fn):', e);
        }
      })();
    }

    // Iniciar pagamento e redirecionar
    if (session?.role === 'client' && session?.email) {
      try {
        const payment = await createOneTimePayment({
          amount: service.price * 100,
          currency: 'BRL',
          description: `Pagamento do agendamento: ${service.name}`,
          customerEmail: session.email,
          metadata: { userId: session.userId, appointmentId: newAppointment.id, serviceId: service.id },
        });
        if (payment.ok) {
          const tx: PaymentTransaction = {
            id: `tx_${Date.now()}`,
            referenceId: payment.referenceId,
            userId: session.userId,
            type: 'one_time',
            amount: service.price,
            currency: 'BRL',
            status: 'pending',
            createdAt: new Date().toISOString(),
            metadata: { appointmentId: newAppointment.id },
          };
          try {
            await supabase.functions.invoke('secure-create-appointment-transaction', {
              body: { transaction: tx },
            });
          } catch (e) { console.warn('Falha ao registrar transação no Supabase (secure fn):', e); }
          if (payment.redirectUrl) {
            window.location.href = payment.redirectUrl;
          }
        } else {
          alert(payment.error || 'Falha ao iniciar pagamento.');
        }
      } catch (e) {
        console.error('Falha ao iniciar pagamento do agendamento:', e);
        alert('Falha ao iniciar pagamento. Tente novamente.');
      }
    }
  };

  const handleAdminLogin = async (email: string, password: string) => {
    const result = await loginAdmin(email, password);
    if (result.ok && result.session) {
      setSession(result.session);
      setAppMode('admin');
      setCurrentView('dashboard');
      navigate('/admin');
    }
    return result;
  };

  const handleClientLogin = async (email: string, password: string) => {
    const result = await loginClient(email, password, tutors);
    if (result.ok && result.session) {
      setSession(result.session);
      setAppMode('client');
      setCurrentView('dashboard');
      navigate('/client');
    }
    return result;
  };

  const handleLogout = () => {
    logout();
    setSession(null);
    setAppMode('login');
    navigate('/');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return appMode === 'client' ? (
          <ClientDashboard appointments={appointments} session={session} />
        ) : (
          <Dashboard appointments={appointments} />
        );
      case 'schedule':
        return <ScheduleView appointments={appointments} pets={pets} tutors={tutors} />;
      case 'clients':
        return <ClientsView pets={pets} tutors={tutors} />;
      case 'petmanagement':
        return <PetManagement pets={pets} tutors={tutors} />;
      default:
        return <Dashboard appointments={appointments} />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'schedule':
        return 'Agenda do Dia';
      case 'clients':
        return 'Clientes e Pets';
      default:
        return 'Dashboard';
    }
  };
  
// Single Routes tree: public and protected routes together
return (
  <Routes>
    <Route
      path="/"
      element={
        <LandingPage
          switchToAdminView={() => navigate('/login')}
          onBookAppointment={handleBookAppointment}
          session={session}
        />
      }
    />
    <Route
      path="/login"
      element={
        session ? (
          <Navigate to={session.role === 'admin' ? '/admin' : '/client'} replace />
        ) : (
          <Login onAdminLogin={handleAdminLogin} onClientLogin={handleClientLogin} />
        )
      }
    />
    <Route
      path="/admin"
      element={
        session && session.role === 'admin' ? (
          <div className="flex h-screen bg-slate-100 text-slate-800">
            <Sidebar 
              currentView={currentView} 
              setCurrentView={setCurrentView} 
              switchToPublicView={() => { setAppMode('login'); navigate('/'); }}
            />
            <main className="flex-1 flex flex-col overflow-y-auto">
              <Header title={getTitle()} session={session} onLogout={handleLogout} />
              <div className="p-4 sm:p-6 lg:p-8 flex-1">
                {renderContent()}
              </div>
            </main>
          </div>
        ) : (
          <Navigate to="/" replace />
        )
      }
    />
    <Route
      path="/client"
      element={
        session && session.role === 'client' ? (
          <div className="flex h-screen bg-slate-100 text-slate-800">
            <main className="flex-1 flex flex-col overflow-y-auto">
              <Header title={getTitle()} session={session} onLogout={handleLogout} />
              <div className="p-4 sm:p-6 lg:p-8 flex-1">
                {renderContent()}
              </div>
            </main>
          </div>
        ) : (
          <Navigate to="/" replace />
        )
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
};

export default App;
