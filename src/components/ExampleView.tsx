import React, { useState } from 'react';
import { ExampleGifts } from './ExampleGifts';
import { ExampleRsvp } from './ExampleRsvp';
import { ExampleBackButton } from './ExampleBackButton';

// Página que se abre con "Ver ejemplo" en la landing. Copia del diseño de referencia
// (frame de 1052px de ancho): todas las medidas están en "u", 1u = 1px a 1052px de ancho
// del viewport y se achica proporcionalmente por debajo, sin crecer por encima.
const u = (n: number) => `calc(${n} * var(--u))`;

const SERIF = "'Instrument Serif', serif";
const SANS = "'Schibsted Grotesk', sans-serif";

const heroButton =
  'uppercase text-white border border-white/80 hover:bg-white/10 transition-colors cursor-pointer whitespace-nowrap';

export const ExampleView: React.FC = () => {
  const [screen, setScreen] = useState<'home' | 'gifts' | 'rsvp'>(() => {
    if (typeof window === 'undefined') return 'home';
    const requested = new URLSearchParams(window.location.search).get('screen');
    return requested === 'gifts' || requested === 'rsvp' ? requested : 'home';
  });

  if (screen === 'gifts') {
    return (
      <>
        <ExampleGifts onNavigate={setScreen} />
        <ExampleBackButton />
      </>
    );
  }

  if (screen === 'rsvp') {
    return (
      <>
        <ExampleRsvp onNavigate={setScreen} />
        <ExampleBackButton />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5]" style={{ ['--u' as string]: 'min(1px, 0.09506vw)' }}>
      <ExampleBackButton />
      {/* Hero: foto original a sangre, oscurecida 30% */}
      <section className="relative w-full aspect-[1052/1002] max-h-screen overflow-hidden">
        <img
          src="/ejemplo-hero.webp"
          alt="Milagros y Juan riendo, abrazados"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center text-white"
          style={{ paddingBottom: u(47) }}
        >
          <h1
            className="font-normal"
            style={{ fontFamily: SERIF, fontSize: u(71), lineHeight: 1, marginBottom: u(10) }}
          >
            Milagros &amp; Juan
          </h1>
          <p
            className="text-white/90"
            style={{ fontFamily: SANS, fontSize: u(12), letterSpacing: '0.05em', lineHeight: 1.2 }}
          >
            24 · 10 · 2026
          </p>
          <div className="bg-white/50" style={{ width: u(44), height: 1, marginTop: u(18), marginBottom: u(29) }}></div>

          <div className="flex items-center" style={{ gap: u(12) }}>
            <button
              id="example-invitacion-btn"
              className={heroButton}
              style={{ fontFamily: SANS, fontSize: u(10.5), height: u(30), padding: `0 ${u(16.5)}` }}
            >
              Información
            </button>
            <button
              id="example-confirmar-btn"
              onClick={() => setScreen('rsvp')}
              className={heroButton}
              style={{ fontFamily: SANS, fontSize: u(10.5), height: u(30), padding: `0 ${u(16.5)}` }}
            >
              Confirmar asistencia
            </button>
            <button
              id="example-regalos-btn"
              onClick={() => setScreen('gifts')}
              className={heroButton}
              style={{ fontFamily: SANS, fontSize: u(10.5), height: u(30), padding: `0 ${u(16.5)}` }}
            >
              Regalos
            </button>
          </div>
        </div>
      </section>

      {/* Bienvenidos */}
      <section className="flex flex-col items-center text-center" style={{ padding: `${u(58)} ${u(24)} ${u(77)}` }}>
        <span
          className="uppercase"
          style={{ fontFamily: SANS, fontSize: u(8), letterSpacing: '0.08em', color: '#786C63', lineHeight: 1.2 }}
        >
          Bienvenidos
        </span>
        <h2
          className="font-normal"
          style={{ fontFamily: SERIF, fontSize: u(34), lineHeight: 1.1, color: '#1C1005', marginTop: u(14) }}
        >
          ¡Nos casamos!
        </h2>
        <p
          style={{
            fontFamily: SERIF,
            fontSize: u(20.8),
            lineHeight: u(26.5),
            color: '#463936',
            maxWidth: u(392),
            marginTop: u(18),
          }}
        >
          Queremos compartir este camino con ustedes. Tu presencia es nuestro mayor regalo, pero si deseás colaborar en el inicio de nuestro hogar, aquí te dejamos algunas ideas.
        </p>
      </section>
    </div>
  );
};
