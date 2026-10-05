import React from 'react';
import { AppView } from '../types';
import { HeroVideo } from './HeroVideo';
import {
  ExampleScreen,
  GiftListSection,
  HappyCouples,
  HowItWorksTimeline,
  MicrositeSection,
  Pricing,
  RsvpSection,
  WhatIncludes,
} from './LandingSections';
import { Wordmark } from './Wordmark';

interface LandingViewProps {
  onNavigate: (view: AppView) => void;
  onOpenExample: (screen?: ExampleScreen) => void;
}

const SANS = "'Schibsted Grotesk', sans-serif";

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, onOpenExample }) => {
  const onCreate = () => onNavigate('register');

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navLink =
    'hidden md:inline text-[12px] font-normal leading-normal uppercase text-[#2C1A0E] hover:opacity-70 transition-opacity cursor-pointer';

  return (
    <div className="min-h-dvh flex flex-col">
      <div>
        <div className="bg-[#F7F1E4] text-[#2A2318]">
          {/* Navigation Header */}
          <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-md px-4 sm:px-8">
            <div className="max-w-5xl mx-auto h-14 sm:h-16 flex items-center justify-between">
              <div onClick={() => onNavigate('landing')} className="cursor-pointer flex items-center gap-3">
                <Wordmark />
              </div>

              <div className="flex items-center gap-5 sm:gap-7">
                <button type="button" onClick={() => onNavigate('find-couple')} className={`${navLink} min-h-11 flex items-center`} style={{ fontFamily: SANS }}>
                  Encontrá a una pareja
                </button>
                <button
                  id="landing-header-login-btn"
                  onClick={() => onNavigate('login')}
                  className="text-[12px] font-normal leading-normal uppercase text-[#2C1A0E] hover:opacity-70 transition-opacity cursor-pointer min-h-11 flex items-center"
                  style={{ fontFamily: SANS }}
                >
                  Iniciar sesión
                </button>
                <button
                  id="landing-header-create-btn"
                  onClick={onCreate}
                  className="text-[12px] font-normal leading-normal uppercase text-[#2C1A0E] bg-white border border-[#2A2318]/40 px-5 min-h-11 flex items-center hover:bg-[#F7F1E4] transition-colors cursor-pointer"
                  style={{ fontFamily: SANS }}
                >
                  Crear mi evento
                </button>
              </div>
            </div>
          </header>

          {/* 1. Hero — foto a sangre completa (video en loop), sin card ni márgenes laterales */}
          <section className="relative w-full min-h-[640px] sm:min-h-0 sm:aspect-[1440/781] overflow-hidden">
            <HeroVideo
              src="/hero-video.mp4"
              label="Pareja de novios celebrando su casamiento"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Velo suave solo en la mitad inferior, para que el texto se lea sobre el video */}
            <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none"></div>

            {/* Bloque de texto según Figma dev-mode (1440px: 1062x500, bottom 68, padding
                40/56, gap 28, radius 2). Todo escala con el ancho del viewport (vw) y
                se detiene en los valores de Figma. En mobile queda anclado abajo. */}
            <div className="absolute z-10 left-1/2 -translate-x-1/2 bottom-0 sm:bottom-[min(28px,2vw)] w-[calc(100%-2rem)] sm:w-[min(1062px,73.75vw)] sm:h-[min(500px,34.72vw)] px-[clamp(16px,3.89vw,56px)] py-[clamp(16px,2.78vw,40px)] gap-[clamp(14px,1.67vw,24px)] flex flex-col items-center text-center rounded-[2px]">
              <h1
                className="text-[clamp(26px,3.33vw,48px)] font-normal text-[#F5F0EA] text-center leading-[1.05] w-full"
                style={{ fontFamily: SANS, textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)' }}
              >
                Organizá tu casamiento en un solo lugar.
              </h1>
              <p
                className="max-w-[560px] text-[clamp(13px,1.15vw,17px)] leading-snug text-[#F5F0EA]/90"
                style={{ fontFamily: SANS, textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)' }}
              >
                Sumate a la plataforma para organizar casamientos que ayudó a miles de parejas.
              </p>
              <div className="flex items-center gap-3">
                <button
                  id="hero-create-list-btn"
                  onClick={onCreate}
                  className="text-[12px] font-normal leading-normal uppercase text-[#2C1A0E] bg-[#F7F1E4] px-6 min-h-11 flex items-center hover:bg-white transition-colors cursor-pointer"
                  style={{ fontFamily: SANS }}
                >
                  Crear mi evento
                </button>
                <button
                  id="hero-view-example-btn"
                  onClick={() => onOpenExample('gifts')}
                  className="text-[12px] font-normal leading-normal uppercase border border-white/70 text-[#F5F0EA] px-6 min-h-11 flex items-center hover:bg-white/10 transition-colors cursor-pointer"
                  style={{ fontFamily: SANS }}
                >
                  Ver ejemplo
                </button>
              </div>
            </div>
          </section>

          {/* 2. Qué incluye Weda — los 4 pilares con el mismo peso visual */}
          <WhatIncludes onCreate={onCreate} onOpenExample={onOpenExample} />

          {/* 3. La lista de regalos moderna — pitch + collage + confianza, todo en una sola sección */}
          <GiftListSection onOpenExample={onOpenExample} />

          {/* 4. Micrositio */}
          <MicrositeSection onCreate={onCreate} />

          {/* 5. RSVP y gestión de invitados */}
          <RsvpSection onCreate={onCreate} />

          {/* 6. Testimonios */}
          <HappyCouples />

          {/* 7. Planes */}
          <Pricing onCreate={onCreate} />

          {/* 8. CTA final — foto a sangre completa con capa #1A0E08 al 60% */}
          <section className="relative w-full min-h-[440px] flex flex-col justify-center items-center px-4 py-8 sm:px-[clamp(24px,8.33vw,120px)] sm:py-[clamp(32px,5vw,72px)] overflow-hidden">
            <img
              src="/cta-manos.webp"
              alt="Manos de los novios entrelazadas junto a un ramo de flores blancas"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(26, 14, 8, 0.6)' }}></div>

            <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center gap-8 text-center px-6 py-6 sm:px-14">
              <div className="flex flex-col items-center gap-5">
                <span className="text-[11px] font-normal uppercase tracking-[0.1em] text-[#F5F0EA]/80">Lo que viene después</span>
                <h2 className="text-[clamp(30px,4.4vw,64px)] leading-[1.05] font-normal text-[#F5F0EA] max-w-[20ch] sm:max-w-[24ch] text-balance">
                  El casamiento es el principio. Que organizarlo sea fácil.
                </h2>
                <p className="text-sm sm:text-base text-[#F5F0EA]/80 max-w-xl">
                  Invitados, RSVP, micrositio y lista de regalos, desde AR$ 99.000, pago único.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  id="cta-create-list-bottom"
                  onClick={onCreate}
                  className="text-xs uppercase font-normal border border-white/70 text-white px-6 min-h-11 flex items-center hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Crear mi evento
                </button>
              </div>
            </div>
          </section>

          {/* Cómo funciona — franja compacta, no sección propia, justo antes del footer */}
          <HowItWorksTimeline />

          {/* Footer */}
          <footer className="relative bg-[#1A0E08] text-[#F7F1E4] px-4 sm:px-8 pt-10 pb-6 overflow-hidden">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
              <div>
                <div className="mb-3">
                  <Wordmark tone="light" />
                </div>
                <p className="text-sm text-[#F7F1E4]/60 leading-relaxed max-w-sm">
                  Invitados, RSVP, micrositio y lista de regalos para organizar tu casamiento en un solo lugar. Hecho en Argentina.
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#A9795A] mb-3">Producto</h4>
                <ul className="space-y-2.5 text-sm text-[#F7F1E4]/70">
                  <li><button onClick={() => scrollTo('como-funciona')} className="hover:text-white transition-colors cursor-pointer">Cómo funciona</button></li>
                  <li><button onClick={() => scrollTo('planes')} className="hover:text-white transition-colors cursor-pointer">Planes</button></li>
                  <li><button onClick={() => onOpenExample('gifts')} className="hover:text-white transition-colors cursor-pointer">Ver ejemplo</button></li>
                  <li><button onClick={onCreate} className="hover:text-white transition-colors cursor-pointer">Crear mi evento</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[#A9795A] mb-3">Soporte</h4>
                <a href="mailto:hola@weda.com.ar" className="text-sm text-[#F7F1E4]/90 hover:text-white transition-colors block mb-2">
                  hola@weda.com.ar
                </a>
                <p className="text-sm text-[#F7F1E4]/60 leading-relaxed">
                  ¿Tenés dudas? Escribinos. Respondemos de lunes a viernes de 9 a 18 hs.
                </p>
              </div>
            </div>

            <span
              aria-hidden="true"
              className="block relative z-0 text-center font-semibold uppercase leading-none text-[#F7F1E4]/[0.06] text-[22vw] mt-4 select-none pointer-events-none"
            >
              WEDA
            </span>

            <div className="max-w-6xl mx-auto pt-6 border-t border-[#F7F1E4]/10 text-xs text-[#F7F1E4]/50 relative z-10">
              <span>© {new Date().getFullYear()} Weda. Todos los derechos reservados.</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
