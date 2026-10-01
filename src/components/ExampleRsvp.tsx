import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { RsvpAttendance } from '../types';
import { addRsvpEntry } from '../utils/rsvpStore';
import { ExampleHero } from './ExampleHero';

const DIETARY_OPTIONS = [
  'Sin restricción',
  'Menú Infantil',
  'Sin sal',
  'Celíaco',
  'Vegetariano',
  'Vegano',
  'APLV',
  'Intolerancia a la Lactosa',
];

// Pantalla "Confirmar asistencia" del ejemplo. El header y la foto de portada son
// compartidos con las otras 2 pantallas (ver ExampleHero). Lo de acá para abajo sigue en
// su propio sistema de medidas "u": 1u = 1px a 1219px de ancho del frame, que a 1440px de
// viewport equivale a 1.181px. Se achica proporcionalmente por debajo y no crece por
// encima de 1440px.
const u = (n: number) => `calc(${n} * var(--u))`;

const SERIF = "'Instrument Serif', serif";
const SANS = "'Schibsted Grotesk', sans-serif";

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: SANS,
  fontSize: u(11),
  fontWeight: 600,
  lineHeight: u(13),
  color: '#282018',
  marginBottom: u(8),
};

const fieldStyle: React.CSSProperties = {
  width: '100%',
  height: u(35),
  padding: `0 ${u(10)}`,
  border: '1px solid #F1F1EF',
  borderRadius: u(2),
  backgroundColor: '#FFFFFF',
  fontFamily: SANS,
  fontSize: u(11.85),
  color: '#282018',
  outline: 'none',
};

interface ExampleRsvpProps {
  onNavigate: (screen: 'home' | 'gifts' | 'rsvp') => void;
}

// Formulario mínimo: 1 persona = 1 respuesta. Sin acompañantes, sin cantidad de
// invitados, sin email/teléfono, sin login. Cada envío es un registro independiente.
export const ExampleRsvp: React.FC<ExampleRsvpProps> = ({ onNavigate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [attendance, setAttendance] = useState<RsvpAttendance>('attending');
  const [dietary, setDietary] = useState(DIETARY_OPTIONS[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    addRsvpEntry({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      attendanceStatus: attendance,
      dietaryRestrictions: dietary === DIETARY_OPTIONS[0] ? undefined : dietary,
    });
    setSubmitted(true);
  };

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

        {submitted ? (
          <div
            className="bg-white flex flex-col items-center text-center"
            style={{ width: `min(${u(589)}, calc(100% - 32px))`, marginTop: u(43), padding: `${u(56)} ${u(39)}`, border: '1px solid #E9E8E4', borderRadius: u(2) }}
          >
            <span
              className="rounded-full flex items-center justify-center bg-[#2D1A0E]"
              style={{ width: u(48), height: u(48) }}
            >
              <Check className="text-white" style={{ width: u(22), height: u(22) }} strokeWidth={2.5} />
            </span>
            <h3 className="font-normal text-[#22180E]" style={{ fontFamily: SERIF, fontSize: u(30), lineHeight: 1.1, marginTop: u(22) }}>
              ¡Gracias por confirmar!
            </h3>
            <p className="text-[#6F625A]" style={{ fontFamily: SANS, fontSize: u(12.5), lineHeight: u(19), marginTop: u(12), maxWidth: u(360) }}>
              {attendance === 'attending'
                ? 'Ya avisamos a Milagros y Juan que vas a estar. ¡Nos vemos en la fiesta!'
                : 'Ya avisamos a Milagros y Juan que no vas a poder estar. ¡Gracias por contarles!'}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white"
            style={{ width: `min(${u(589)}, calc(100% - 32px))`, marginTop: u(43), padding: `${u(40)} ${u(39)}`, border: '1px solid #E9E8E4', borderRadius: u(2) }}
          >
            <div className="grid grid-cols-2" style={{ columnGap: u(16.5) }}>
              <div>
                <label htmlFor="rsvp-first-name" style={labelStyle}>Nombre</label>
                <input
                  id="rsvp-first-name"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Tu nombre"
                  className="rsvp-field"
                  style={fieldStyle}
                />
              </div>
              <div>
                <label htmlFor="rsvp-last-name" style={labelStyle}>Apellido</label>
                <input
                  id="rsvp-last-name"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Tu apellido"
                  className="rsvp-field"
                  style={fieldStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: u(16) }}>
              <span style={labelStyle}>¿Asistirás?</span>
              <div className="grid grid-cols-2" style={{ columnGap: u(10) }}>
                <button
                  id="rsvp-attending-yes"
                  type="button"
                  role="radio"
                  aria-checked={attendance === 'attending'}
                  onClick={() => setAttendance('attending')}
                  className="cursor-pointer transition-colors"
                  style={{
                    height: u(42),
                    borderRadius: u(2),
                    fontFamily: SANS,
                    fontSize: u(11.8),
                    fontWeight: 600,
                    border: '1px solid ' + (attendance === 'attending' ? '#2D1A0E' : '#F1F1EF'),
                    backgroundColor: attendance === 'attending' ? '#2D1A0E' : '#FFFFFF',
                    color: attendance === 'attending' ? '#FFFFFF' : '#544A42',
                  }}
                >
                  Sí, asistiré
                </button>
                <button
                  id="rsvp-attending-no"
                  type="button"
                  role="radio"
                  aria-checked={attendance === 'declined'}
                  onClick={() => setAttendance('declined')}
                  className="cursor-pointer transition-colors"
                  style={{
                    height: u(42),
                    borderRadius: u(2),
                    fontFamily: SANS,
                    fontSize: u(11.5),
                    fontWeight: attendance === 'declined' ? 600 : 400,
                    border: '1px solid ' + (attendance === 'declined' ? '#2D1A0E' : '#F1F1EF'),
                    backgroundColor: attendance === 'declined' ? '#2D1A0E' : '#FFFFFF',
                    color: attendance === 'declined' ? '#FFFFFF' : '#544A42',
                  }}
                >
                  No podré asistir
                </button>
              </div>
            </div>

            <div style={{ marginTop: u(16) }}>
              <label htmlFor="rsvp-dietary" style={labelStyle}>Menú especial</label>
              <div className="relative">
                <select
                  id="rsvp-dietary"
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="rsvp-field appearance-none cursor-pointer"
                  style={{ ...fieldStyle, paddingRight: u(30) }}
                >
                  {DIETARY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute pointer-events-none text-[#544A42]"
                  style={{ width: u(13), height: u(13), right: u(11), top: '50%', transform: 'translateY(-50%)' }}
                  strokeWidth={2}
                />
              </div>
            </div>

            <button
              id="rsvp-submit-btn"
              type="submit"
              className="uppercase text-white w-full cursor-pointer hover:opacity-90 transition-opacity"
              style={{ marginTop: u(28), height: u(41), borderRadius: u(2), backgroundColor: '#2D1A0E', fontFamily: SANS, fontSize: u(12), fontWeight: 500 }}
            >
              Enviar confirmación
            </button>
          </form>
        )}
      </section>

    </div>
  );
};
