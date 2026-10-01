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
// asistencia, Regalos). En mobile ocupa casi toda la altura de la pantalla (dvh, pensado
// para los tamaños promedio de iPhone); desde sm en adelante vuelve a la proporción por
// ancho (clamp en vw) que tenía antes, para que en desktop no quede desmedida. Las letras
// y los espacios también tienen su propio tamaño fijo para mobile (más grandes y legibles
// que el piso del clamp anterior) y mantienen el clamp por vw desde sm.
export const ExampleHero: React.FC<ExampleHeroProps> = ({ active, onNavigate }) => {
  return (
    <section className="sticky top-0 relative w-full overflow-hidden h-[88dvh] min-h-[560px] max-h-[820px] sm:h-[45vw] sm:min-h-[300px] sm:max-h-[620px]">
        <img
          src="/mili-juan-hero.jpg"
          alt="Milagros y Juan riendo, abrazados"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center text-white px-4 pb-10 sm:pb-[clamp(28px,5vw,56px)]">
          <h1
            className="font-normal text-[34px] sm:text-[clamp(26px,4.6vw,56px)]"
            style={{ fontFamily: SERIF, lineHeight: 1 }}
          >
            Milagros &amp; Juan
          </h1>
          <p
            className="text-white/90 text-[11.5px] sm:text-[clamp(9px,0.95vw,13px)] mt-2.5 sm:mt-[clamp(6px,1vw,14px)]"
            style={{ fontFamily: SANS, letterSpacing: '0.05em', lineHeight: 1 }}
          >
            24 · 10 · 2026
          </p>
          <div className="bg-white/50 w-8 h-px mt-4 sm:w-[clamp(24px,3.2vw,44px)] sm:mt-[clamp(10px,1.6vw,22px)]"></div>

          <div className="flex items-center flex-nowrap justify-center w-full px-3 gap-2 mt-6 sm:gap-[clamp(4px,1vw,14px)] sm:mt-[clamp(14px,2.4vw,32px)]">
            {NAV_ITEMS.map((item) => {
              const isActive = item.id === active;
              return (
                <button
                  key={item.id}
                  id={`example-${item.id}-btn`}
                  onClick={() => !isActive && onNavigate(item.id)}
                  className={`uppercase border transition-colors whitespace-nowrap flex items-center justify-center shrink-0 text-[11px] h-9 px-4 sm:text-[clamp(7.5px,0.85vw,12px)] sm:h-[clamp(22px,2.6vw,36px)] sm:px-[clamp(6px,1.4vw,20px)] ${
                    isActive
                      ? 'bg-white text-[#2A1A0D] border-white cursor-default'
                      : 'text-white border-white/70 hover:bg-white/10 cursor-pointer'
                  }`}
                  style={{ fontFamily: SANS, letterSpacing: '0.01em' }}
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
