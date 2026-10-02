import React from 'react';
import { ExampleHero } from './ExampleHero';
import { RsvpFormCard } from './RsvpFormCard';

// Pantalla "Confirmar asistencia" del ejemplo. El header y la foto de portada son
// compartidos con las otras 2 pantallas (ver ExampleHero). Lo de acá para abajo sigue en
// su propio sistema de medidas "u": 1u = 1px a 1219px de ancho del frame, que a 1440px de
// viewport equivale a 1.181px. Se achica proporcionalmente por debajo y no crece por
// encima de 1440px.
const u = (n: number) => `calc(${n} * var(--u))`;

const SERIF = "'Instrument Serif', serif";
const SANS = "'Schibsted Grotesk', sans-serif";

interface ExampleRsvpProps {
  onNavigate: (screen: 'home' | 'gifts' | 'rsvp') => void;
}

// El formulario en sí (campos, estado y el resultado al enviar) vive en RsvpFormCard,
// compartido con el bloque CTA embebido en la invitación (ver ExampleView) — acá solo
// queda el armado de la pantalla dedicada: header + eyebrow "Confirmación" + la tarjeta.
export const ExampleRsvp: React.FC<ExampleRsvpProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#FBF9F5]" style={{ ['--u' as string]: 'clamp(1px, 0.08203vw, 1.1813px)' }}>
      <ExampleHero active="rsvp" onNavigate={onNavigate} />

      {/* Confirmación. Fondo sólido (no "sticky": este bloque ya es más alto que la
          pantalla y nada lo sigue, así que alcanza con que tape al hero de arriba
          scrolleando normal, sin pisarlo él mismo — "sticky" acá dejaría la pantalla
          congelada un buen tramo de scroll sin que se vea nada moverse).
          Título grande apenas se entra acá (en vez de un simple eyebrow chiquito): así
          queda clarísimo que tocar "RSVP" en el header te trajo a una pantalla distinta de
          la invitación, no es solo un cambio de pestaña que puede pasar desapercibido. */}
      <section
        className="relative z-10 flex flex-col items-center text-center"
        style={{ paddingTop: u(56), paddingBottom: u(101), backgroundColor: '#FBF9F5' }}
      >
        <span className="uppercase font-medium text-[#6B6B6B]" style={{ fontFamily: SANS, fontSize: u(12), letterSpacing: '0.08em' }}>
          RSVP
        </span>
        <h2 className="font-normal text-[#2B2B2B]" style={{ fontFamily: SERIF, fontSize: u(42), lineHeight: 1.1, marginTop: u(10) }}>
          Confirmá tu asistencia
        </h2>
        <p style={{ fontFamily: SANS, fontSize: u(15), lineHeight: u(22), color: '#6B6B6B', marginTop: u(10), maxWidth: u(380) }}>
          Contanos si vas a poder acompañarnos: es muy importante para la organización.
        </p>

        <RsvpFormCard u={u} />
      </section>

    </div>
  );
};
