import React, { useState } from 'react';
import { services } from '../services/mockData';
import { Service, Tutor, Pet, Appointment, UserSession, PaymentTransaction } from '../types';
import BookingModal from './BookingModal';
import DogIcon from './icons/DogIcon';
import StarIcon from './icons/StarIcon';
import CheckIcon from './icons/CheckIcon';
import schedulingFeatureImage from './assets/Agendamento Fácil.png';
import healthFeatureImage from './assets/Histórico de Saúde.png';
import remindersFeatureImage from './assets/Lembretes Inteligentes.png';
import { createOneTimePayment, createSubscription } from '../services/abacateService';
import { recordTransaction } from '../services/transactionService';
import { db } from '../services/db';

const heroImage =
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1600&q=80';

interface LandingPageProps {
  switchToAdminView: () => void;
  onBookAppointment: (service: Service, newTutor: Tutor, newPet: Pet, newAppointment: Appointment) => void;
  session?: UserSession | null;
}

const LandingPage: React.FC<LandingPageProps> = ({ switchToAdminView, onBookAppointment, session }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);

  const handleOpenModal = (service: Service) => {
    setSelectedService(service);
  };

  const handlePlanSubscribe = async (planId: string, amount: number) => {
    if (!session) {
      setPaymentMessage('Você precisa estar logado como cliente para assinar um plano.');
      return;
    }
    setPaymentMessage(null);
    const result = await createSubscription({
      amount: amount * 100,
      currency: 'BRL',
      description: `Assinatura do plano ${planId}`,
      customerEmail: session.email,
      planId,
      metadata: { userId: session.userId, planId }
    });
    if (result.ok) {
      setPaymentMessage('Redirecionando para pagamento...');
      const tx: PaymentTransaction = {
        id: `tx_${Date.now()}`,
        referenceId: result.referenceId,
        userId: session.userId,
        type: 'subscription',
        amount,
        currency: 'BRL',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      recordTransaction(tx);
      try {
        await db.insertTransaction(tx);
      } catch (e) {
        console.warn('Falha ao registrar transação no Supabase:', e);
      }
      // Redirect to Abacate checkout
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } else {
      setPaymentMessage(result.error || 'Falha ao iniciar assinatura.');
    }
  };

  const handlePrepaidBooking = async (service: Service) => {
    if (!session) {
      setPaymentMessage('Você precisa estar logado como cliente para agendar.');
      return;
    }
    setPaymentMessage(null);
    const result = await createOneTimePayment({
      amount: service.price * 100,
      currency: 'BRL',
      description: `Pagamento prévio do serviço: ${service.name}`,
      customerEmail: session.email,
      metadata: { userId: session.userId, serviceId: service.id }
    });
    if (result.ok) {
      setPaymentMessage('Redirecionando para pagamento...');
      const tx: PaymentTransaction = {
        id: `tx_${Date.now()}`,
        referenceId: result.referenceId,
        userId: session.userId,
        type: 'one_time',
        amount: service.price,
        currency: 'BRL',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      recordTransaction(tx);
      try {
        await db.insertTransaction(tx);
      } catch (e) {
        console.warn('Falha ao registrar transação no Supabase:', e);
      }
      // Redireciona para o checkout do Abacate
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
      // Após retorno do gateway via webhook, confirmaremos e abriremos fluxo de agendamento
    } else {
      setPaymentMessage(result.error || 'Falha no pagamento. Tente novamente.');
    }
  };

  const handleCloseModal = () => {
    setSelectedService(null);
  };
  
  const features = [
    'Profissionais Certificados',
    'Produtos Hipoalergênicos',
    'Ambiente Climatizado',
    'Atendimento Personalizado',
    'Segurança e Conforto',
    'Amor e Carinho'
  ];

  const testimonials = [
    { name: 'Juliana S.', quote: 'O Thor sempre volta pra casa super cheiroso e feliz! A equipe é maravilhosa e muito atenciosa. Recomendo de olhos fechados!', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Marcos P.', quote: 'Melhor tosa da cidade! A Mia fica linda e o pelo super macio com a hidratação. O agendamento online facilitou muito minha vida.', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Fernanda L.', quote: 'Levei o Loki para o banho medicamentoso e o resultado foi incrível. Eles realmente entendem do que fazem e cuidam do nosso pet como se fosse deles.', avatar: 'https://i.pravatar.cc/150?img=5' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans leading-relaxed">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <DogIcon className="w-9 h-9 text-sky-500" />
            <span className="text-2xl font-bold ml-2 tracking-tight">PetManager</span>
          </div>
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#services" className="font-medium text-slate-600 hover:text-sky-600 transition-colors">Serviços</a>
            <a href="#plans" className="font-medium text-slate-600 hover:text-sky-600 transition-colors">Planos</a>
            <a href="#why-us" className="font-medium text-slate-600 hover:text-sky-600 transition-colors">Diferenciais</a>
          </nav>
          <div className="flex items-center">
            <button 
              onClick={switchToAdminView}
              className="text-sm font-semibold text-sky-600 hover:text-sky-800 transition-colors hidden sm:block"
            >
              Acessar Painel
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden ml-4 text-slate-700">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-16 6h16"></path></svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white py-4">
              <nav className="flex flex-col items-center space-y-4">
                 <a href="#services" onClick={()=>setIsMenuOpen(false)} className="font-medium text-slate-600 hover:text-sky-600">Serviços</a>
                 <a href="#plans" onClick={()=>setIsMenuOpen(false)} className="font-medium text-slate-600 hover:text-sky-600">Planos</a>
                 <a href="#why-us" onClick={()=>setIsMenuOpen(false)} className="font-medium text-slate-600 hover:text-sky-600">Diferenciais</a>
                 <button onClick={switchToAdminView} className="font-semibold text-sky-600 hover:text-sky-800 pt-2 border-t border-slate-200 w-full text-center">Acessar Painel</button>
              </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative text-white text-center py-20 sm:py-24 px-4 overflow-hidden bg-cover bg-center" style={{backgroundImage: `url(${heroImage})`}}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="container mx-auto relative">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 animate-fade-in-up">Cuidado Premium para seu Melhor Amigo</h1>
                <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Oferecemos os melhores serviços de banho e tosa com profissionais qualificados e muito amor pelos animais.</p>
                <a href="#services" className="bg-white text-sky-600 font-bold py-3 px-8 rounded-full hover:bg-slate-100 transition-transform transform hover:scale-105 inline-block animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    Ver Serviços
                </a>
            </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-16 sm:py-20 bg-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-2">Nossos Serviços</h2>
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">Cuidados especiais pensados para o bem-estar e a felicidade do seu pet.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map(service => (
                <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
                  <img src={service.imageUrl} alt={service.name} className="w-full h-48 object-cover" />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                    <p className="text-slate-600 text-sm flex-grow mb-4">{service.description}</p>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-sky-600">R$ {service.price.toFixed(2).replace('.',',')}</span>
                        <span className="text-sm text-slate-500">{service.duration} min</span>
                    </div>
                    <button 
                      onClick={() => handlePrepaidBooking(service)}
                      className="w-full mt-auto bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors"
                    >
                      Agendar (pago)
                    </button>
                    <button 
                      onClick={() => handlePlanSubscribe('plano-premium', service.price)}
                      className="w-full mt-2 bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Assinar Plano
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section id="plans" className="py-16 sm:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-2">Planos Mensais</h2>
                <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">Escolha o plano ideal para o seu pet e aproveite benefícios exclusivos com economia.</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-5xl mx-auto">
                    {/* Basic Plan */}
                    <div className="border border-slate-200 rounded-lg p-8 h-full flex flex-col">
                        <h3 className="text-2xl font-bold mb-2">Básico</h3>
                        <p className="text-slate-500 mb-6">O essencial para o seu pet estar sempre limpo e feliz.</p>
                        <ul className="space-y-4 text-slate-600 mb-8 flex-grow">
                            <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>4 Banhos Simples</b> por mês</span></li>
                            <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>1 Check-up</b> rápido da pelagem e pele</span></li>
                            <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>1 Corte de Unhas</b> por mês</span></li>
                             <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>10% de Desconto</b> em serviços avulsos</span></li>
                        </ul>
                        <button 
                          onClick={() => handlePlanSubscribe('plano-basico', 80)}
                          className="w-full mt-auto bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700 transition-colors"
                        >
                          Assinar Agora
                        </button>
                    </div>
                    {/* Premium Plan */}
                    <div className="border-2 border-sky-500 rounded-lg p-8 relative h-full flex flex-col shadow-sky-100 shadow-2xl">
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <span className="bg-sky-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase flex items-center"><StarIcon className="w-4 h-4 mr-1.5" /> Mais Popular</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Premium</h3>
                        <p className="text-slate-500 mb-6">O pacote completo de cuidados e estética para um pet radiante.</p>
                        <ul className="space-y-4 text-slate-600 mb-8 flex-grow">
                            <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>4 Banhos Especiais e 1 Tosa</b> completa por mês</span></li>
                            <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>2 Hidratações</b> profissionais</span></li>
                            <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>1 Higiene Dental</b> simples</span></li>
                            <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>20% de Desconto</b> em Day Care</span></li>
                        </ul>
                        <button 
                          onClick={() => handlePlanSubscribe('plano-premium', 120)}
                          className="w-full mt-auto bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700 transition-colors"
                        >
                          Assinar Agora
                        </button>
                    </div>
                    {/* VIP Plan */}
                    <div className="border border-slate-200 rounded-lg p-8 h-full flex flex-col">
                        <h3 className="text-2xl font-bold mb-2">VIP</h3>
                        <p className="text-slate-500 mb-6">A experiência definitiva em cuidados, saúde e conveniência.</p>
                        <ul className="space-y-4 text-slate-600 mb-8 flex-grow">
                            <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>Banhos e Tosa Higiênica Ilimitados</b></span></li>
                             <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>1 Tosa Estilizada e 2 Hidratações</b> premium</span></li>
                            <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>Transporte Gratuito</b> (2 coletas/entregas)</span></li>
                            <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>1 Consulta Veterinária</b> (check-up)</span></li>
                             <li className="flex items-start"><CheckIcon className="w-5 h-5 text-sky-500 mr-3 mt-1 flex-shrink-0" /><span><b>30% de Desconto</b> em Hotelzinho</span></li>
                        </ul>
                        <button 
                          onClick={() => handlePlanSubscribe('plano-vip', 200)}
                          className="w-full mt-auto bg-sky-600 text-white font-semibold py-3 rounded-lg hover:bg-sky-700 transition-colors"
                        >
                          Assinar Agora
                        </button>
                    </div>
                </div>
            </div>
        </section>


        {/* Why Us Section */}
        <section id="why-us" className="py-16 sm:py-20 bg-slate-100">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                     <h2 className="text-3xl font-bold mb-4">Por que nos escolher?</h2>
                     <p className="text-slate-600 max-w-2xl mx-auto mb-12">Garantimos uma experiência segura, confortável e agradável para o seu pet em cada visita.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="h-48 bg-gray-200">
                        <img
                          src={schedulingFeatureImage}
                          alt="Agendamento de pets"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Agendamento Fácil</h3>
                        <p className="text-gray-600">Agende serviços com poucos cliques. Nosso sistema intuitivo torna o cuidado com o pet simples e conveniente.</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="h-48 bg-gray-200">
                        <img
                          src={healthFeatureImage}
                          alt="Registros de saúde do pet"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Histórico de Saúde</h3>
                        <p className="text-gray-600">Mantenha todos os registros médicos do seu pet em um só lugar. Acompanhe vacinas, medicações e consultas com facilidade.</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="h-48 bg-gray-200">
                        <img
                          src={remindersFeatureImage}
                          alt="Lembretes para cuidados com pets"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">Lembretes Inteligentes</h3>
                        <p className="text-gray-600">Não perca compromissos importantes ou horários de medicação. Receba notificações na hora certa para todas as necessidades do seu pet.</p>
                      </div>
                    </div>
                </div>
             </div>
        </section>


        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 sm:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">O que nossos clientes dizem</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <div key={index} className="bg-slate-50 p-8 rounded-lg border border-slate-200">
                            <div className="flex items-center mb-4">
                                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <p className="font-bold">{t.name}</p>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5" />)}
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-600 italic">"{t.quote}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>
      {paymentMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-lg shadow-md px-4 py-2 text-sm">
          {paymentMessage}
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} PetManager. Todos os direitos reservados.</p>
          <p className="text-sm mt-2">Feito com ❤️ para os pets</p>
        </div>
      </footer>
      
      {selectedService && (
        <BookingModal 
          service={selectedService} 
          onClose={handleCloseModal}
          onBook={(tutor, pet, appointment) => onBookAppointment(selectedService, tutor, pet, appointment)}
        />
      )}

      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default LandingPage;
