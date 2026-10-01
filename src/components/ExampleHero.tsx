import React from 'react';
import { ArrowDown } from 'lucide-react';

const SERIF = "'Instrument Serif', serif";
const SANS = "'Schibsted Grotesk', sans-serif";

export type ExampleScreen = 'home' | 'gifts' | 'rsvp';

const NAV_ITEMS: { id: ExampleScreen; label: string }[] = [
  { id: 'home', label: 'Invitación' },
  { id: 'rsvp', label: 'RSVP' },
  { id: 'gifts', label: 'Regalá' },
];

interface ExampleHeroProps {
  active: ExampleScreen;
  onNavigate: (screen: ExampleScreen) => void;
}

// Foto de portada compartida por las 3 pantallas del ejemplo (Información, Confirmar
// asistencia, Regalos). Ocupa la pantalla completa (100dvh) tanto en mobile como en
// desktop — antes en desktop volvía a una proporción por ancho más baja, pero la idea es
// que la primera impresión sea la foto a pantalla completa, como una invitación real.
// El título+fecha+nav van siempre abajo (nunca centrados verticalmente) sobre la foto, y
// debajo de todo eso el indicador fijo de "Deslizá" invita a seguir bajando.
export const ExampleHero: React.FC<ExampleHeroProps> = ({ active, onNavigate }) => {
  return (
    <section className="sticky top-0 relative w-full overflow-hidden h-[100dvh]">
        <img
          src="/mili-juan-hero.jpg"
          alt="Milagros y Juan riendo, abrazados"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center text-white px-4 pb-24 sm:pb-28">
          <h1
            className="font-normal text-[24px] sm:text-[clamp(18px,3.2vw,40px)]"
            style={{ fontFamily: SERIF, lineHeight: 1 }}
          >
            Milagros &amp; Juan
          </h1>
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

        <div className="absolute inset-x-0 bottom-8 sm:bottom-10 z-10 flex flex-col items-center text-white/85 pointer-events-none">
          <span
            className="uppercase text-[10px] sm:text-[11px]"
            style={{ fontFamily: SANS, letterSpacing: '0.15em' }}
          >
            Deslizá
          </span>
          <ArrowDown className="w-4 h-4 mt-2 animate-bounce" strokeWidth={1.5} />
        </div>
      </section>
  );
};
