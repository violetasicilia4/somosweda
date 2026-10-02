import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { RsvpAttendance } from '../types';
import { addRsvpEntry } from '../utils/rsvpStore';

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

const SERIF = "'Instrument Serif', serif";
const SANS = "'Schibsted Grotesk', sans-serif";

interface RsvpFormCardProps {
  // Cada pantalla que usa esta tarjeta tiene su propio sistema de medidas "u" (ver
  // ExampleView.tsx / ExampleRsvp.tsx) — se la pasamos como prop en vez de importarla,
  // para que la tarjeta se adapte a la escala de quien la use.
  u: (n: number) => string;
}

// Tarjeta de "Confirmar asistencia": mismo formulario (y mismo resultado al enviar) que
// usa la pantalla dedicada de RSVP (ExampleRsvp) y, embebida, el bloque CTA de la
// invitación (ExampleView) — para que confirmar se pueda hacer ahí mismo, sin navegar.
export const RsvpFormCard: React.FC<RsvpFormCardProps> = ({ u }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [attendance, setAttendance] = useState<RsvpAttendance>('attending');
  const [dietary, setDietary] = useState(DIETARY_OPTIONS[0]);
  const [submitted, setSubmitted] = useState(false);

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: SANS,
    fontSize: u(13.5),
    fontWeight: 600,
    lineHeight: u(16),
    color: '#2B2B2B',
    marginBottom: u(8),
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    height: u(44),
    padding: `0 ${u(12)}`,
    border: '1px solid #E7ECF1',
    borderRadius: u(2),
    backgroundColor: '#FFFFFF',
    fontFamily: SANS,
    fontSize: u(15),
    color: '#2B2B2B',
    outline: 'none',
  };

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

  // Vuelve a un formulario en blanco para que la misma persona pueda cargar a otro
  // invitado de su familia/grupo sin tener que buscar el link de nuevo — cada envío ya
  // queda guardado como un registro propio (ver handleSubmit / addRsvpEntry).
  const resetForNextGuest = () => {
    setFirstName('');
    setLastName('');
    setAttendance('attending');
    setDietary(DIETARY_OPTIONS[0]);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div
        className="bg-white flex flex-col items-center text-center"
        style={{ width: `min(${u(620)}, calc(100% - 32px))`, marginTop: u(43), padding: `${u(56)} ${u(39)}`, border: '1px solid #E2E9F0', borderRadius: u(2) }}
      >
        <span
          className="rounded-full flex items-center justify-center bg-[#16283D]"
          style={{ width: u(48), height: u(48) }}
        >
          <Check className="text-white" style={{ width: u(22), height: u(22) }} strokeWidth={2.5} />
        </span>
        <h3 className="font-normal text-[#2B2B2B]" style={{ fontFamily: SERIF, fontSize: u(36), lineHeight: 1.1, marginTop: u(22) }}>
          ¡Gracias por confirmar!
        </h3>
        <p className="text-[#6B6B6B]" style={{ fontFamily: SANS, fontSize: u(15.5), lineHeight: u(23), marginTop: u(12), maxWidth: u(360) }}>
          {attendance === 'attending' ? '¡Nos vemos en la fiesta!' : '¡Gracias por avisarnos!'}
        </p>
        <button
          type="button"
          onClick={resetForNextGuest}
          className="uppercase cursor-pointer hover:opacity-70 transition-opacity"
          style={{
            fontFamily: SANS,
            fontSize: u(13.5),
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: '#16283D',
            border: '1px solid #16283D',
            padding: `${u(14)} ${u(26)}`,
            borderRadius: u(2),
            marginTop: u(24),
          }}
        >
          Agregar otro invitado
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white"
      style={{ width: `min(${u(620)}, calc(100% - 32px))`, marginTop: u(43), padding: `${u(40)} ${u(39)}`, border: '1px solid #E2E9F0', borderRadius: u(2) }}
    >
      <p
        className="text-center"
        style={{ fontFamily: SANS, fontSize: u(14), lineHeight: u(20), color: '#6B6B6B', marginBottom: u(22) }}
      >
        Completá un formulario por cada persona que asista.
      </p>

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
              height: u(50),
              borderRadius: u(2),
              fontFamily: SANS,
              fontSize: u(15),
              fontWeight: 600,
              border: '1px solid ' + (attendance === 'attending' ? '#16283D' : '#E7ECF1'),
              backgroundColor: attendance === 'attending' ? '#16283D' : '#FFFFFF',
              color: attendance === 'attending' ? '#FFFFFF' : '#3D3D3D',
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
              height: u(50),
              borderRadius: u(2),
              fontFamily: SANS,
              fontSize: u(14.5),
              fontWeight: attendance === 'declined' ? 600 : 400,
              border: '1px solid ' + (attendance === 'declined' ? '#16283D' : '#E7ECF1'),
              backgroundColor: attendance === 'declined' ? '#16283D' : '#FFFFFF',
              color: attendance === 'declined' ? '#FFFFFF' : '#3D3D3D',
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
            style={{ ...fieldStyle, paddingRight: u(32) }}
          >
            {DIETARY_OPTIONS.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <ChevronDown
            className="absolute pointer-events-none text-[#3D3D3D]"
            style={{ width: u(16), height: u(16), right: u(12), top: '50%', transform: 'translateY(-50%)' }}
            strokeWidth={2}
          />
        </div>
      </div>

      <button
        id="rsvp-submit-btn"
        type="submit"
        className="uppercase text-white w-full cursor-pointer hover:opacity-90 transition-opacity"
        style={{ marginTop: u(28), height: u(50), borderRadius: u(2), backgroundColor: '#16283D', fontFamily: SANS, fontSize: u(15), fontWeight: 500 }}
      >
        Enviar confirmación
      </button>
    </form>
  );
};
