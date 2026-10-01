import React from 'react';
import { ExampleHero } from './ExampleHero';
import { RsvpFormCard } from './RsvpFormCard';

// Pantalla "Confirmar asistencia" del ejemplo. El header y la foto de portada son
// compartidos con las otras 2 pantallas (ver ExampleHero). Lo de acá para abajo sigue en
// su propio sistema de medidas "u": 1u = 1px a 1219px de ancho del frame, que a 1440px de
// viewport equivale a 1.181px. Se achica proporcionalmente por debajo y no crece por
// encima de 1440px.
const u = (n: number) => `calc(${n} * var(--u))`;

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
          congelada un buen tramo de scroll sin que se vea nada moverse). */}
      <section
        className="relative z-10 flex flex-col items-center"
        style={{ paddingTop: u(42), paddingBottom: u(101), backgroundColor: '#FBF9F5' }}
      >
        <h2 className="uppercase font-medium text-[#7B6F63]" style={{ fontFamily: SANS, fontSize: u(13), lineHeight: 1, position: 'relative', left: u(-3.5) }}>
          Confirmación
        </h2>

        <RsvpFormCard u={u} />
      </section>

    </div>
  );
};
