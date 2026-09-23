import React from 'react';
import { AppView } from '../types';
import { Users, CalendarCheck, Gift, Globe, Check } from 'lucide-react';
import { pricingPlans } from '../data/initialData';

interface LandingViewProps {
  onNavigate: (view: AppView) => void;
  onOpenExample: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onOpenExample }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Reproducción pixel-fiel del diseño aprobado en Figma (frame
          "weda-editorial-landing"): marco oscuro alrededor de toda la página,
          tipografía Quicksand y paleta marfil/terracota/tinta en todas las
          secciones, de punta a punta. */}
      <div className="bg-[#171310] p-2 sm:p-3" style={{ fontFamily: "'Quicksand', sans-serif" }}>
      <div className="bg-[#F7F1E4] text-[#2A2318]">
      {/* Navigation Header */}
      <header className="bg-white px-4 sm:px-8">
        <div className="max-w-6xl mx-auto h-16 sm:h-20 flex items-center justify-between">
          <div
            onClick={() => onNavigate('landing')}
            className="cursor-pointer flex items-center gap-3"
          >
            <span
              className="text-[22px] font-normal leading-normal uppercase text-[#2C1A0E]"
              style={{ fontFamily: "'Schibsted Grotesk', sans-serif" }}
            >
              Weda
            </span>
            <span className="text-[9px] tracking-[0.15em] uppercase text-[#2A2318] border border-[#2A2318]/40 rounded-full px-2.5 py-1">
              Casamientos
            </span>
          </div>

          <div className="flex items-center gap-5 sm:gap-7">
            <button
              id="landing-header-login-btn"
              onClick={() => onNavigate('login')}
              className="text-sm text-[#2A2318] hover:opacity-70 transition-opacity cursor-pointer"
            >
              Iniciar sesión
            </button>
            <button
              id="landing-header-create-btn"
              onClick={() => onNavigate('register')}
              className="text-xs uppercase tracking-wider font-medium bg-white text-[#2A2318] border border-[#2A2318]/40 px-5 py-2.5 hover:bg-[#F7F1E4] transition-colors cursor-pointer"
            >
              Crear mi lista
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section — foto a sangre completa, sin card ni márgenes laterales */}
      <section className="relative w-full aspect-4/5 sm:aspect-[1440/781] overflow-hidden">
        <img
          src="/hero-couple.webp"
          alt="Pareja de novios celebrando su casamiento"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Bloque de texto según Figma dev-mode: absolute, left 189 / bottom 68, 1062x500,
            padding 40px 56px, flex column, align center, gap 28px, radius 2px. El alto
            fijo de 500 solo aplica desde xl, donde el hero es lo bastante alto. */}
        <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-6 xl:bottom-[68px] w-[calc(100%-2rem)] xl:w-[1062px] xl:h-[500px] px-4 py-6 xl:px-14 xl:py-10 flex flex-col items-center gap-7 text-center rounded-[2px]">
          <span
            className="text-[14px] font-normal uppercase text-center text-[#F5F0E9] leading-[1.4] tracking-[1.4px]"
            style={{ fontFamily: "'Schibsted Grotesk', sans-serif", textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}
          >
            Planificá tu casamiento
          </span>
          <h1
            className="text-4xl md:text-5xl xl:text-[56px] font-normal text-[#F5F0EA] text-center leading-[1.05] w-full"
            style={{ fontFamily: "'Schibsted Grotesk', sans-serif", textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}
          >
            Armá tu lista de regalos e invitados de tu casamiento en un solo lugar.
          </h1>

          <div className="flex items-center gap-3">
            <button
              id="hero-create-list-btn"
              onClick={() => onNavigate('register')}
              className="text-xs uppercase tracking-wider font-medium bg-[#F7F1E4] text-[#2A2318] px-6 py-3 hover:bg-white transition-colors cursor-pointer"
            >
              Crear mi lista
            </button>
            <button
              id="hero-view-example-btn"
              onClick={onOpenExample}
              className="text-xs uppercase tracking-wider font-medium border border-white/70 text-white px-6 py-3 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Ver ejemplo
            </button>
          </div>
        </div>
      </section>

      {/* Herramientas Integradas */}
      <section className="py-20 sm:py-24 bg-[#F0E8D8] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-[#A9795A] uppercase">
              Herramientas integradas
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium text-[#2A2318] mt-3">
              Todo lo que necesitás para organizar tu evento.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Card 1 */}
            <div>
              <Users className="w-6 h-6 text-[#A9795A] mb-4" strokeWidth={1.5} />
              <h3 className="font-semibold text-base text-[#2A2318] mb-1.5">Invitados</h3>
              <p className="text-sm text-[#7A6F5F] leading-relaxed">
                Gestioná tu lista completa, confirmaciones y datos de cada invitado en un solo lugar.
              </p>
            </div>

            {/* Card 2 */}
            <div>
              <CalendarCheck className="w-6 h-6 text-[#A9795A] mb-4" strokeWidth={1.5} />
              <h3 className="font-semibold text-base text-[#2A2318] mb-1.5">RSVP</h3>
              <p className="text-sm text-[#7A6F5F] leading-relaxed">
                Confirmaciones online en tiempo real, sin planillas ni seguimientos manuales.
              </p>
            </div>

            {/* Card 3 */}
            <div>
              <Gift className="w-6 h-6 text-[#A9795A] mb-4" strokeWidth={1.5} />
              <h3 className="font-semibold text-base text-[#2A2318] mb-1.5">Regalos</h3>
              <p className="text-sm text-[#7A6F5F] leading-relaxed">
                Recibí aportes y regalos digitales con total transparencia y sin intermediarios.
              </p>
            </div>

            {/* Card 4 */}
            <div>
              <Globe className="w-6 h-6 text-[#A9795A] mb-4" strokeWidth={1.5} />
              <h3 className="font-semibold text-base text-[#2A2318] mb-1.5">Sitio Web</h3>
              <p className="text-sm text-[#7A6F5F] leading-relaxed">
                Tu propia página de casamiento, diseñada con elegancia y lista en minutos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planes y Precios */}
      <section className="py-20 sm:py-24 bg-white px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest text-[#A9795A] uppercase">
              Precios transparentes
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium text-[#2A2318] mt-3">
              Elegí tu plan ideal.
            </h2>
            <p className="text-sm text-[#7A6F5F] mt-2">
              Probalo gratis y publicalo cuando estés listo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl overflow-hidden bg-white border border-[#E7DCC8] flex flex-col"
              >
                <div className="relative aspect-4/3">
                  <img
                    src={plan.previewImage}
                    alt={plan.previewAlt}
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-white text-[#2A2318] text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {plan.name}
                    </span>
                    {plan.badge && (
                      <span className="bg-[#2A2318] text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex flex-col grow">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A9795A]">
                    {plan.name}
                  </span>
                  <span className="block text-[11px] uppercase tracking-wide text-gray-400 mt-0.5">
                    {plan.experienceType}
                  </span>
                  <div className="text-2xl font-semibold text-[#2A2318] mt-2">{plan.price}</div>
                  <p className="text-sm text-[#7A6F5F] mt-1 min-h-[36px]">{plan.tagline}</p>

                  <ul className="space-y-2.5 mt-4 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#5A5142]">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    id={`plan-choose-${plan.id}`}
                    onClick={() => onNavigate('register')}
                    className={`w-full py-3 px-4 text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer mt-auto ${
                      plan.recommended
                        ? 'bg-[#2A2318] text-white hover:bg-black'
                        : 'bg-white border border-[#2A2318]/30 text-[#2A2318] hover:bg-[#F7F1E4]'
                    }`}
                  >
                    Elegir {plan.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 sm:py-24 bg-[#F0E8D8] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <span className="text-xs font-semibold tracking-widest text-[#A9795A] uppercase">
              Parejas felices
            </span>
            <h2 className="text-3xl sm:text-4xl font-medium text-[#2A2318] mt-3">
              Testimonios con amor.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2A2318]/15 border-t border-[#2A2318]/15">
            {/* Testimonial 1 */}
            <div className="pt-8 md:pr-8 md:first:pr-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#2A2318] font-semibold text-xs shrink-0">
                  M&S
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#2A2318]">Martina & Sebastián</h4>
                  <p className="text-xs text-[#8A8072]">Febrero 2026 · San Antonio de Areco</p>
                </div>
              </div>
              <p className="text-sm text-[#5A5142] leading-relaxed">
                Excelente plataforma. El RSVP en tiempo real nos ahorró horas de responder mensajes por WhatsApp. Súper recomendada la lista de bodas simbólica.
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="pt-8 md:px-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#2A2318] font-semibold text-xs shrink-0">
                  C&F
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#2A2318]">Camila & Francisco</h4>
                  <p className="text-xs text-[#8A8072]">Noviembre 2025 · Mendoza</p>
                </div>
              </div>
              <p className="text-sm text-[#5A5142] leading-relaxed">
                El sistema de regalos digitales funcionó de maravilla. Pudimos centralizar todos los aportes de nuestros invitados del exterior sin ningún problema.
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="pt-8 md:pl-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#2A2318] font-semibold text-xs shrink-0">
                  V&A
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#2A2318]">Victoria & Alejandro</h4>
                  <p className="text-xs text-[#8A8072]">Enero 2026 · Buenos Aires</p>
                </div>
              </div>
              <p className="text-sm text-[#5A5142] leading-relaxed">
                La interfaz es muy intuitiva, el sitio web nos quedó hermoso y pudimos compartir todos los detalles del menú y la ubicación en un solo lugar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner — foto a sangre completa, sin card ni márgenes */}
      <section className="relative w-full">
        <div className="relative aspect-4/5 sm:aspect-21/9 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1600&q=80"
            alt="Fondo romántico de boda"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/55"></div>

          {/* Bloque de texto según Figma dev-mode: absolute, left 189 / bottom 68, 1062x500,
            padding 40px 56px, flex column, align center, gap 28px, radius 2px. El alto
            fijo de 500 solo aplica desde xl, donde el hero es lo bastante alto. */}
        <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-6 xl:bottom-[68px] w-[calc(100%-2rem)] xl:w-[1062px] xl:h-[500px] px-4 py-6 xl:px-14 xl:py-10 flex flex-col items-center gap-7 text-center rounded-[2px]">
            <h2 className="text-2xl sm:text-4xl font-medium text-white mb-3 max-w-xl">
              Tu historia merece algo más que una invitación.
            </h2>
            <p className="text-sm text-white/80 mb-7 max-w-md">
              Creá tu sitio, organizá tus invitados y recibí regalos en un solo lugar. Sin estrés, sin complicaciones.
            </p>
            <button
              id="cta-create-list-bottom"
              onClick={() => onNavigate('register')}
              className="text-xs uppercase tracking-wider font-medium border border-white/70 text-white px-6 py-3 hover:bg-white/10 transition-colors cursor-pointer mb-4"
            >
              Crear mi lista gratis
            </button>
            <p className="text-xs text-white/60">
              No necesitás tarjeta de crédito para empezar.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#171310] text-[#F7F1E4] px-4 sm:px-8 pt-16 pb-8 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
          <div className="md:col-span-1">
            <span className="text-lg font-semibold tracking-[0.1em] uppercase block mb-3">Weda</span>
            <p className="text-sm text-[#F7F1E4]/60 leading-relaxed">
              La plataforma contemporánea para organizar tu casamiento de punta a punta. Creada con orgullo en Argentina para celebraciones con sentido y belleza.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#A9795A] mb-3">Herramientas</h4>
            <ul className="space-y-2.5 text-sm text-[#F7F1E4]/70">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">Sitio Web</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">Lista de Invitados</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">Confirmación RSVP</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">Regalos Digitales</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#A9795A] mb-3">Compañía</h4>
            <ul className="space-y-2.5 text-sm text-[#F7F1E4]/70">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">Sobre Nosotros</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">Blog Editorial</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">Contacto</button></li>
              <li><button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">Preguntas Frecuentes</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#A9795A] mb-3">Contacto & Soporte</h4>
            <a href="mailto:hola@weda.com.ar" className="text-sm text-[#F7F1E4]/90 hover:text-white transition-colors block mb-2">
              hola@weda.com.ar
            </a>
            <p className="text-sm text-[#F7F1E4]/60 leading-relaxed">
              ¿Tenés dudas? Nuestro atelier de soporte está disponible de lunes a viernes de 9 a 18 hs.
            </p>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="block relative z-0 text-center font-semibold uppercase leading-none text-[#F7F1E4]/[0.06] text-[22vw] mt-8 select-none pointer-events-none"
        >
          WEDA
        </span>

        <div className="max-w-6xl mx-auto pt-6 border-t border-[#F7F1E4]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F7F1E4]/50 gap-2 relative z-10">
          <span>© {new Date().getFullYear()} Weda Casamientos. Todos los derechos reservados.</span>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">Políticas de Privacidad</button>
            <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer">Términos del Servicio</button>
          </div>
        </div>
      </footer>
      </div>
      </div>
    </div>
  );
};
