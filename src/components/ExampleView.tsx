import React, { useState } from 'react';
import { ExampleGifts } from './ExampleGifts';
import { ExampleRsvp } from './ExampleRsvp';
import { ExampleBackButton } from './ExampleBackButton';
import { ExampleHero } from './ExampleHero';

// Página que se abre con "Ver ejemplo" en la landing. El header y la foto de portada son
// compartidos por las 3 pantallas (ver ExampleHero) para que no cambien de tamaño al
// navegar entre ellas. Lo de acá para abajo (Bienvenidos) sigue en su propio sistema de
// medidas "u": 1u = 1px a 1052px de ancho del viewport, se achica proporcionalmente por
// debajo y no crece por encima.
const u = (n: number) => `calc(${n} * var(--u))`;

const SERIF = "'Instrument Serif', serif";
const SANS = "'Schibsted Grotesk', sans-serif";

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
      <ExampleHero active="home" onNavigate={setScreen} />

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
