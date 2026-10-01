import React from 'react';

const SERIF = "'Instrument Serif', serif";
const SANS = "'Schibsted Grotesk', sans-serif";

export type ExampleScreen = 'home' | 'gifts' | 'rsvp';

const NAV_ITEMS: { id: ExampleScreen; label: string }[] = [
  { id: 'home', label: 'Información' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'gifts', label: 'Regalos' },
];

interface ExampleHeroProps {
  active: ExampleScreen;
  onNavigate: (screen: ExampleScreen) => void;
}

// Foto de portada compartida por las 3 pantallas del ejemplo (Información, Confirmar
// asistencia, Regalos). Medidas fijas con clamp() (no el sistema "u" por pantalla que
// tenía cada archivo antes), así al cambiar de pantalla nada de acá para arriba cambia de
// tamaño — solo el contenido debajo de la foto es distinto en cada una. La página arranca
// directo en la foto, sin barra superior.
export const ExampleHero: React.FC<ExampleHeroProps> = ({ active, onNavigate }) => {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(300px, 45vw, 620px)' }}>
        <img
          src="/mili-juan-hero.jpg"
          alt="Milagros y Juan riendo, abrazados"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center text-white px-4"
          style={{ paddingBottom: 'clamp(28px, 5vw, 56px)' }}
        >
          <h1 className="font-normal" style={{ fontFamily: SERIF, fontSize: 'clamp(26px, 4.6vw, 56px)', lineHeight: 1 }}>
            Milagros &amp; Juan
          </h1>
          <p
            className="text-white/90"
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(9px, 0.95vw, 13px)',
              letterSpacing: '0.05em',
              lineHeight: 1,
              marginTop: 'clamp(6px, 1vw, 14px)',
            }}
          >
            24 · 10 · 2026
          </p>
          <div
            className="bg-white/50"
            style={{ width: 'clamp(24px, 3.2vw, 44px)', height: 1, marginTop: 'clamp(10px, 1.6vw, 22px)' }}
          ></div>

          <div
            className="flex items-center flex-nowrap justify-center w-full px-3"
            style={{ gap: 'clamp(4px, 1vw, 14px)', marginTop: 'clamp(14px, 2.4vw, 32px)' }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === active;
              return (
                <button
                  key={item.id}
                  id={`example-${item.id}-btn`}
                  onClick={() => !isActive && onNavigate(item.id)}
                  className={`uppercase border transition-colors whitespace-nowrap flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-white text-[#2A1A0D] border-white cursor-default'
                      : 'text-white border-white/70 hover:bg-white/10 cursor-pointer'
                  }`}
                  style={{
                    fontFamily: SANS,
                    fontSize: 'clamp(7.5px, 0.85vw, 12px)',
                    height: 'clamp(22px, 2.6vw, 36px)',
                    padding: '0 clamp(6px, 1.4vw, 20px)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>
  );
};
