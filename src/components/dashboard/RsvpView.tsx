import React, { useEffect, useRef, useState } from 'react';
import { ManualGuest, ManualGuestStatus, RsvpEntry, WeddingData, WeddingPlan } from '../../types';
import { getRsvpEntries, subscribeToRsvpEntries } from '../../utils/rsvpStore';
import { isTabLocked } from '../../utils/plan';
import { LockedFeatureNotice } from './LockedFeatureNotice';
import { Check, Circle, Link2, MessageCircle, Plus, Trash2, Upload, UserCheck, X } from 'lucide-react';

interface RsvpViewProps {
  wedding: WeddingData;
  onSelectPlan: (plan: WeddingPlan) => void;
  manualGuests: ManualGuest[];
  onAddManualGuest: (guest: Omit<ManualGuest, 'id'>) => void;
  onUpdateManualGuestStatus: (id: string, status: ManualGuestStatus) => void;
  onDeleteManualGuest: (id: string) => void;
  onImportManualGuests: (guests: Omit<ManualGuest, 'id'>[]) => void;
}

const manualStatusMeta: Record<ManualGuestStatus, { label: string; className: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }> = {
  confirmado: { label: 'Confirmado', className: 'bg-gray-900 text-white', icon: Check },
  pendiente: { label: 'Pendiente', className: 'bg-white border border-gray-300 text-gray-600', icon: Circle },
  'no-asiste': { label: 'No asiste', className: 'bg-transparent text-gray-400 line-through', icon: X },
};

// El estado de una fila manual se ciclea con un click: pendiente → confirmado → no
// asiste → pendiente. Sencillo, sin dropdowns.
const nextManualStatus: Record<ManualGuestStatus, ManualGuestStatus> = {
  pendiente: 'confirmado',
  confirmado: 'no-asiste',
  'no-asiste': 'pendiente',
};

// Parser de CSV mínimo (exportado desde Excel/Sheets): espera columnas
// Nombre, Apellido, Estado, Teléfono (opcional), en ese orden, con o sin encabezado.
const parseGuestsCsv = (text: string): Omit<ManualGuest, 'id'>[] => {
  const statusMap: Record<string, ManualGuestStatus> = {
    confirmado: 'confirmado',
    confirmada: 'confirmado',
    pendiente: 'pendiente',
    'no asiste': 'no-asiste',
    'no asistira': 'no-asiste',
    'no asistirá': 'no-asiste',
  };
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(',').map((cell) => cell.trim().replace(/^"|"$/g, '')))
    .filter((cells) => cells.length >= 2)
    .filter((cells) => cells[0].toLowerCase() !== 'nombre') // salta el encabezado si vino
    .map(([firstName, lastName, statusRaw, phoneRaw]) => ({
      firstName,
      lastName: lastName || '',
      status: statusMap[(statusRaw || '').toLowerCase().trim()] ?? 'pendiente',
      phone: phoneRaw?.trim() || undefined,
    }));
};

// Clave para cruzar una respuesta del formulario público con un invitado de la lista
// manual: mismo nombre y apellido, sin importar mayúsculas/acentos ni espacios extra.
const normalizeName = (firstName: string, lastName: string) =>
  `${firstName} ${lastName}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .replace(/\s+/g, ' ');

type GuestOrigin = 'form' | 'manual' | 'both';

interface UnifiedGuestRow {
  key: string;
  firstName: string;
  lastName: string;
  origin: GuestOrigin;
  status: ManualGuestStatus;
  dietaryRestrictions?: string;
  message?: string;
  formEntry?: RsvpEntry;
  manualGuest?: ManualGuest;
}

export const RsvpView: React.FC<RsvpViewProps> = ({
  wedding,
  onSelectPlan,
  manualGuests,
  onAddManualGuest,
  onUpdateManualGuestStatus,
  onDeleteManualGuest,
  onImportManualGuests,
}) => {
  const [rsvpEntries, setRsvpEntries] = useState<RsvpEntry[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<ManualGuestStatus>('pendiente');
  const [importFeedback, setImportFeedback] = useState('');
  const [openMessageFor, setOpenMessageFor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRsvpEntries(getRsvpEntries());
    const unsubscribe = subscribeToRsvpEntries(() => setRsvpEntries(getRsvpEntries()));
    return unsubscribe;
  }, []);

  // Antes esto eran dos listas que "no se cruzan" (ver el comentario que había acá antes
  // de este cambio): si un invitado confirmaba desde el micrositio Y la pareja lo tenía
  // cargado a mano, aparecía duplicado en la tabla y se contaba dos veces en las
  // métricas de arriba. Ahora se cruzan por nombre+apellido en una sola fila por
  // persona — cuando hay respuesta del formulario, esa es la que manda (es la acción
  // real del invitado), la carga manual queda como referencia.
  const formByName = new Map<string, RsvpEntry>();
  rsvpEntries.forEach((entry) => formByName.set(normalizeName(entry.firstName, entry.lastName), entry));

  const matchedManualKeys = new Set<string>();
  const unifiedRows: UnifiedGuestRow[] = [];

  manualGuests.forEach((guest) => {
    const key = normalizeName(guest.firstName, guest.lastName);
    const formEntry = formByName.get(key);
    if (formEntry) {
      matchedManualKeys.add(key);
      unifiedRows.push({
        key,
        firstName: guest.firstName,
        lastName: guest.lastName,
        origin: 'both',
        status: formEntry.attendanceStatus === 'attending' ? 'confirmado' : 'no-asiste',
        dietaryRestrictions: formEntry.dietaryRestrictions,
        message: formEntry.message,
        formEntry,
        manualGuest: guest,
      });
    } else {
      unifiedRows.push({
        key,
        firstName: guest.firstName,
        lastName: guest.lastName,
        origin: 'manual',
        status: guest.status,
        manualGuest: guest,
      });
    }
  });

  rsvpEntries.forEach((entry) => {
    const key = normalizeName(entry.firstName, entry.lastName);
    if (matchedManualKeys.has(key)) return; // ya se agregó arriba, fusionada con la fila manual
    unifiedRows.push({
      key: `form-${entry.id}`,
      firstName: entry.firstName,
      lastName: entry.lastName,
      origin: 'form',
      status: entry.attendanceStatus === 'attending' ? 'confirmado' : 'no-asiste',
      dietaryRestrictions: entry.dietaryRestrictions,
      message: entry.message,
      formEntry: entry,
    });
  });

  const confirmados = unifiedRows.filter((r) => r.status === 'confirmado').length;
  const pendientes = unifiedRows.filter((r) => r.status === 'pendiente').length;
  const noAsisten = unifiedRows.filter((r) => r.status === 'no-asiste').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    onAddManualGuest({ firstName: firstName.trim(), lastName: lastName.trim(), status, phone: phone.trim() || undefined });
    setFirstName('');
    setLastName('');
    setPhone('');
    setStatus('pendiente');
    setIsAddOpen(false);
  };

  // Recordatorio: con teléfono cargado, le escribe directo a ese número; sin teléfono,
  // igual abre WhatsApp con el mensaje ya armado para elegir el contacto a mano. Así
  // "pendientes" deja de ser solo un número — hay algo para hacer con eso.
  const buildReminderHref = (guest: ManualGuest) => {
    const text = encodeURIComponent(
      `¡Hola ${guest.firstName}! Te escribimos de parte de ${wedding.coupleName || 'los novios'} para saber si ya podés confirmar tu asistencia a la boda. ¡Gracias!`
    );
    const digits = guest.phone?.replace(/[^0-9]/g, '');
    return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      const parsed = parseGuestsCsv(text);
      if (parsed.length === 0) {
        setImportFeedback('No encontramos filas para importar. Revisá que el archivo tenga Nombre, Apellido y Estado.');
      } else {
        onImportManualGuests(parsed);
        setImportFeedback(`${parsed.length} invitado${parsed.length === 1 ? '' : 's'} importado${parsed.length === 1 ? '' : 's'}.`);
      }
      setTimeout(() => setImportFeedback(''), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // RSVP se desbloquea desde el plan Evento en adelante. Nunca se oculta la pestaña:
  // si el plan actual no la incluye, se muestra esta pantalla en vez del contenido — los
  // invitados y respuestas que ya existan no se tocan ni se pierden.
  if (isTabLocked('rsvp', wedding)) {
    return (
      <LockedFeatureNotice
        wedding={wedding}
        requiredPlan="invitados-rsvp"
        icon={UserCheck}
        title="Gestioná tus invitados"
        description="Cargá invitados, seguí confirmaciones y organizá tu evento desde un solo lugar."
        onSelectPlan={onSelectPlan}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl pb-16">
      <div>
        <h2 className="text-2xl sm:text-3xl font-normal text-gray-900">RSVP</h2>
        <p className="text-sm text-gray-500 mt-1">
          Tu lista de invitados, cruzada con las confirmaciones que llegan desde tu micrositio.
        </p>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-3xl p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Confirmados</span>
          <span className="text-3xl font-bold text-gray-900 mt-2 block">{confirmados}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-3xl p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Pendientes</span>
          <span className="text-3xl font-bold text-gray-900 mt-2 block">{pendientes}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-3xl p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">No asistirán</span>
          <span className="text-3xl font-bold text-gray-900 mt-2 block">{noAsisten}</span>
        </div>
      </div>

      {/* LISTA DE INVITADOS UNIFICADA: cruza por nombre+apellido la respuesta del
          formulario público con la carga manual del organizador, en vez de mostrarlas
          como dos tablas separadas que había que conciliar a mano. */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Invitados</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Cuando alguien confirma desde tu micrositio y ya lo tenías cargado, se fusiona en una sola fila.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="uppercase px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-normal rounded-2xl inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="uppercase px-3 py-2 bg-gray-900 hover:bg-black text-white text-xs font-normal rounded-2xl inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar invitado</span>
            </button>
          </div>
        </div>

        {importFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-900">
            {importFeedback}
          </div>
        )}

        {unifiedRows.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-3xl p-8 text-center">
            <p className="text-sm text-gray-500">
              Todavía no hay invitados. Cargalos a mano, importá un CSV, o esperá a que alguien confirme desde tu micrositio.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Apellido</th>
                    <th className="px-4 py-3 font-semibold">Origen</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Menú / mensaje</th>
                    <th className="px-4 py-3 font-semibold w-28">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {unifiedRows.map((row) => {
                    const meta = manualStatusMeta[row.status];
                    const StatusIcon = meta.icon;
                    const rowMessageId = row.formEntry?.id ?? row.key;
                    return (
                      <React.Fragment key={row.key}>
                        <tr className="text-gray-800">
                          <td className="px-4 py-3 font-medium">{row.firstName}</td>
                          <td className="px-4 py-3">{row.lastName}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                                row.origin === 'both'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : row.origin === 'form'
                                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                              title={
                                row.origin === 'both'
                                  ? 'Confirmó desde tu micrositio y estaba en tu lista manual'
                                  : row.origin === 'form'
                                    ? 'Confirmó desde tu micrositio, todavía no está en tu lista manual'
                                    : 'Cargado a mano, todavía no respondió desde tu micrositio'
                              }
                            >
                              {row.origin === 'both' && <Link2 className="w-2.5 h-2.5" />}
                              {row.origin === 'both' ? 'Sitio + lista' : row.origin === 'form' ? 'Sitio' : 'Manual'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {row.manualGuest && row.origin === 'manual' ? (
                              <button
                                type="button"
                                onClick={() => onUpdateManualGuestStatus(row.manualGuest!.id, nextManualStatus[row.manualGuest!.status])}
                                title="Tocá para cambiar el estado"
                                className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold cursor-pointer transition-colors ${meta.className}`}
                              >
                                <StatusIcon className="w-3 h-3" strokeWidth={2.5} />
                                {meta.label}
                              </button>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                                  row.status === 'confirmado'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-transparent text-gray-400 line-through'
                                }`}
                              >
                                <StatusIcon className="w-3 h-3" strokeWidth={2.5} />
                                {meta.label}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {row.dietaryRestrictions || (row.message ? '—' : '—')}
                            {row.message && (
                              <button
                                type="button"
                                onClick={() => setOpenMessageFor(openMessageFor === rowMessageId ? null : rowMessageId)}
                                aria-label="Ver mensaje"
                                className={`ml-1.5 inline-flex p-1 rounded-xl cursor-pointer transition-colors align-middle ${
                                  openMessageFor === rowMessageId ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                                }`}
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {row.origin === 'form' && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onAddManualGuest({
                                      firstName: row.firstName,
                                      lastName: row.lastName,
                                      status: row.status,
                                    })
                                  }
                                  className="uppercase px-2.5 py-1 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-[10px] font-semibold cursor-pointer whitespace-nowrap"
                                >
                                  + A mi lista
                                </button>
                              )}
                              {row.manualGuest && row.status === 'pendiente' && (
                                <a
                                  href={buildReminderHref(row.manualGuest)}
                                  target="_blank"
                                  rel="noreferrer"
                                  aria-label="Recordar por WhatsApp"
                                  title="Recordar por WhatsApp"
                                  className="p-1.5 rounded-xl text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {row.manualGuest && (
                                <button
                                  type="button"
                                  onClick={() => onDeleteManualGuest(row.manualGuest!.id)}
                                  aria-label={row.origin === 'both' ? 'Quitar de mi lista manual' : 'Eliminar invitado'}
                                  title={row.origin === 'both' ? 'Quitar de mi lista manual' : 'Eliminar invitado'}
                                  className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {openMessageFor === rowMessageId && row.message && (
                          <tr>
                            <td colSpan={6} className="px-4 pb-3 -mt-1">
                              <p className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-2xl p-3 italic">
                                "{row.message}"
                              </p>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* MODAL: AGREGAR INVITADO */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-gray-100 animate-fade-in space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">Agregar invitado</h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Teléfono <span className="font-normal text-gray-400 normal-case">(opcional, para recordarle por WhatsApp)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+54 9 11 ..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estado</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['pendiente', 'confirmado', 'no-asiste'] as ManualGuestStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-2 rounded-2xl text-[11px] font-semibold uppercase cursor-pointer transition-colors border ${
                        status === s ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {manualStatusMeta[s].label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="uppercase w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-normal cursor-pointer transition-colors"
              >
                Agregar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
