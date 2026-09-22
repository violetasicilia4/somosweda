import React from 'react';
import { AppView } from '../types';
import { Users, CalendarCheck, Gift, Globe, Check, ArrowRight, Heart } from 'lucide-react';
import { pricingPlans } from '../data/initialData';

interface LandingViewProps {
  onNavigate: (view: AppView) => void;
  onOpenExample: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onOpenExample }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-xs sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div 
            onClick={() => onNavigate('landing')}
            className="cursor-pointer flex items-center gap-2"
          >
            <span className="font-serif text-2xl font-medium tracking-tight text-gray-900">Weda</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button
              id="landing-header-login-btn"
              onClick={() => onNavigate('login')}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Iniciar sesión
            </button>
            <button
              id="landing-header-register-btn"
              onClick={() => onNavigate('register')}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors hidden sm:inline-block"
            >
              Registrarse
            </button>
            <button
              id="landing-header-create-btn"
              onClick={() => onNavigate('register')}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-none transition-all shadow-xs cursor-pointer"
            >
              Crear mi lista
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-6 pb-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {/* Hero Banner Image Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-16/10 sm:aspect-21/9 max-h-[500px] w-full mb-10 flex items-center justify-center text-center p-6 sm:p-12">
          <img 
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80" 
            alt="Pareja de novios sonriendo en su casamiento" 
            className="absolute inset-0 w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/40 backdrop-brightness-95"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-white flex flex-col items-center">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-white/90 mb-3 bg-white/15 px-3.5 py-1 rounded-full backdrop-blur-md">
              Planificá tu casamiento
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-4 leading-tight">
              Armá la lista de invitados y regalos de tu casamiento en un solo lugar.
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              Creá tu sitio, gestioná confirmaciones, organizá invitados y recibí regalos digitales.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center">
              <button
                id="hero-create-list-btn"
                onClick={() => onNavigate('register')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white text-gray-900 hover:bg-gray-100 font-semibold rounded-none text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                Crear mi lista gratis
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-view-example-btn"
                onClick={onOpenExample}
                className="w-full sm:w-auto px-6 py-3.5 bg-transparent hover:bg-white/10 text-white font-medium rounded-none text-sm transition-all border border-white/40 hover:border-white cursor-pointer"
              >
                Ver ejemplo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Herramientas Integradas */}
      <section className="py-24 sm:py-32 bg-gray-100/50 border-y border-gray-200 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
              Herramientas integradas
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-gray-900 mt-2">
              Todo lo que necesitás para organizar tu evento.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800 mb-5">
                <Users className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-serif font-semibold text-lg text-gray-900 mb-1.5">Invitados</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Gestioná asistencia y acompañantes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800 mb-5">
                <CalendarCheck className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-serif font-semibold text-lg text-gray-900 mb-1.5">RSVP</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Confirmaciones online en tiempo real.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800 mb-5">
                <Gift className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-serif font-semibold text-lg text-gray-900 mb-1.5">Regalos</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Recibí aportes y regalos digitales.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-800 mb-5">
                <Globe className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="font-serif font-semibold text-lg text-gray-900 mb-1.5">Sitio Web</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Compartí toda la información de tu evento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes y Precios */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-gray-900">
            Elegí tu plan ideal.
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Probalo gratis y publicalo cuando estés listo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`rounded-2xl p-7 flex flex-col justify-between transition-all relative ${
                plan.recommended 
                  ? 'border-2 border-gray-900 shadow-lg bg-white ring-1 ring-gray-900/5' 
                  : 'border border-gray-200 bg-white shadow-2xs hover:border-gray-300'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] tracking-wider font-bold py-1 px-3 rounded-full uppercase">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="font-serif text-xl font-medium text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 min-h-[36px]">{plan.tagline}</p>

                <div className="my-6 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400 block uppercase font-medium">{plan.experienceType}</span>
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">{plan.price}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-600">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                id={`plan-choose-${plan.id}`}
                onClick={() => onNavigate('register')}
                className={`w-full py-3 px-4 rounded-none text-sm font-semibold transition-all cursor-pointer ${
                  plan.recommended
                    ? 'bg-gray-900 text-white hover:bg-black shadow-xs'
                    : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-50'
                }`}
              >
                Elegir {plan.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Simplificá tu Organización (Steps 01-04) */}
      <section className="py-24 sm:py-32 bg-gray-100/50 border-t border-gray-200 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
              Simplificá tu organización
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-gray-900 mt-2">
              Tu evento listo en pocos pasos.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold mb-4">
                01
              </span>
              <h3 className="font-serif font-semibold text-gray-900 text-base mb-1.5">Crear cuenta</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Registrate en segundos para acceder al panel.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold mb-4">
                02
              </span>
              <h3 className="font-serif font-semibold text-gray-900 text-base mb-1.5">Configurar tu evento</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Personalizá el diseño, fecha y datos clave.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold mb-4">
                03
              </span>
              <h3 className="font-serif font-semibold text-gray-900 text-base mb-1.5">Agregar invitados</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Cargá tu lista de contactos fácilmente.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-xs font-bold mb-4">
                04
              </span>
              <h3 className="font-serif font-semibold text-gray-900 text-base mb-1.5">Compartir y recibir</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Enviá tu sitio y recibí confirmaciones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="text-center mb-14">
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
            Parejas felices
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-gray-900 mt-2">
            Testimonios con amor.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Testimonial 1 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-sm">
                  M&S
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Martina & Sebastián</h4>
                  <p className="text-xs text-gray-400">Febrero 2026</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                "Excelente plataforma. El RSVP en tiempo real nos ahorró horas de responder mensajes por WhatsApp. Súper recomendado."
              </p>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-sm">
                  C&F
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Camila & Francisco</h4>
                  <p className="text-xs text-gray-400">Noviembre 2025</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                "El sistema de regalos digitales funcionó de maravilla. Pudimos centralizar todos los aportes de nuestros invitados del exterior sin problemas."
              </p>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-2xs flex flex-col justify-between">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-sm">
                  V&A
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">Victoria & Alejandro</h4>
                  <p className="text-xs text-gray-400">Enero 2026</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                "La interfaz es muy intuitiva, el sitio web nos quedó hermoso y pudimos compartir todos los detalles del menú y la ubicación en un solo lugar."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="px-4 sm:px-6 mb-16 max-w-6xl mx-auto w-full">
        <div className="relative rounded-2xl overflow-hidden shadow-lg p-8 sm:p-12 text-center text-white flex flex-col items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80" 
            alt="Fondo romántico de boda"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/65 backdrop-blur-xs"></div>

          <div className="relative z-10 max-w-xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium mb-3">
              Tu historia merece algo más que una invitación.
            </h2>
            <p className="text-sm sm:text-base text-white/80 mb-6 font-normal">
              Creá tu sitio, organizá tus invitados y recibí regalos en un solo lugar.
            </p>
            <button
              id="cta-create-list-bottom"
              onClick={() => onNavigate('register')}
              className="px-6 py-3.5 bg-white text-gray-900 hover:bg-gray-100 font-semibold rounded-none text-sm transition-all shadow-md cursor-pointer mb-3"
            >
              Crear mi lista gratis
            </button>
            <p className="text-xs text-white/60">
              No necesitás pagar para empezar.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="font-serif text-2xl font-medium text-gray-900 block mb-2">Weda</span>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm leading-relaxed">
              La plataforma definitiva para organizar los preparativos y lista de regalos de tu casamiento sin estrés.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Navegación</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-gray-900">
                  Planes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-gray-900">
                  Preguntas frecuentes
                </button>
              </li>
              <li>
                <button onClick={onOpenExample} className="hover:text-gray-900">
                  Ver ejemplo de sitio
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Contacto</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              <li>soporte@weda.com</li>
              <li>
                <a href="#instagram" className="hover:text-gray-900">Instagram</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <span>© {new Date().getFullYear()} Weda. Todos los derechos reservados.</span>
          <span>Hecho con amor para parejas de todo el mundo.</span>
        </div>
      </footer>
    </div>
  );
};
