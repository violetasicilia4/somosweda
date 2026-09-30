import React, { useEffect, useRef, useState } from 'react';
import { ManualGuest, ManualGuestStatus, RsvpEntry } from '../../types';
import { getRsvpEntries, subscribeToRsvpEntries } from '../../utils/rsvpStore';
import { Check, Circle, MessageCircle, Plus, Trash2, Upload, X } from 'lucide-react';

interface RsvpViewProps {
  manualGuests: ManualGuest[];
  onAddManualGuest: (guest: Omit<ManualGuest, 'id'>) => void;
  onUpdateManualGuestStatus: (id: string, status: ManualGuestStatus) => void;
  onDeleteManualGuest: (id: string) => void;
  onImportManualGuests: (guests: Omit<ManualGuest, 'id'>[]) => void;
}

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
};

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
// Nombre, Apellido, Estado, en ese orden, con o sin fila de encabezado.
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
    .map(([firstName, lastName, statusRaw]) => ({
      firstName,
      lastName: lastName || '',
      status: statusMap[(statusRaw || '').toLowerCase().trim()] ?? 'pendiente',
    }));
};

export const RsvpView: React.FC<RsvpViewProps> = ({
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
  const [status, setStatus] = useState<ManualGuestStatus>('pendiente');
  const [importFeedback, setImportFeedback] = useState('');
  const [openMessageFor, setOpenMessageFor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRsvpEntries(getRsvpEntries());
    const unsubscribe = subscribeToRsvpEntries(() => setRsvpEntries(getRsvpEntries()));
    return unsubscribe;
  }, []);

  const confirmados = manualGuests.filter((g) => g.status === 'confirmado').length + rsvpEntries.filter((e) => e.attendanceStatus === 'attending').length;
  const pendientes = manualGuests.filter((g) => g.status === 'pendiente').length;
  const noAsisten = manualGuests.filter((g) => g.status === 'no-asiste').length + rsvpEntries.filter((e) => e.attendanceStatus === 'declined').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    onAddManualGuest({ firstName: firstName.trim(), lastName: lastName.trim(), status });
    setFirstName('');
    setLastName('');
    setStatus('pendiente');
    setIsAddOpen(false);
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

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl pb-16">
      <div>
        <h2 className="text-2xl sm:text-3xl font-normal text-gray-900">RSVP</h2>
        <p className="text-sm text-gray-500 mt-1">
          Confirmaciones de asistencia que llegan desde tu micrositio, más tu propia lista de invitados.
        </p>
      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Confirmados</span>
          <span className="text-3xl font-bold text-gray-900 mt-2 block">{confirmados}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Pendientes</span>
          <span className="text-3xl font-bold text-gray-900 mt-2 block">{pendientes}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">No asistirán</span>
          <span className="text-3xl font-bold text-gray-900 mt-2 block">{noAsisten}</span>
        </div>
      </div>

      {/* TABLA RSVP: respuestas del formulario público */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Respuestas del formulario</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Lo que tus invitados completaron en "Confirmar asistencia" de tu micrositio.
          </p>
        </div>

        {rsvpEntries.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-500">
              Todavía no recibiste respuestas. Compartí el link de tu micrositio para que empiecen a llegar.
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Apellido</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold">Menú especial</th>
                    <th className="px-4 py-3 font-semibold">Fecha respuesta</th>
                    <th className="px-4 py-3 font-semibold w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rsvpEntries.map((entry) => (
                    <React.Fragment key={entry.id}>
                      <tr className="text-gray-800">
                        <td className="px-4 py-3 font-medium">{entry.firstName}</td>
                        <td className="px-4 py-3">{entry.lastName}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold ${
                              entry.attendanceStatus === 'attending'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {entry.attendanceStatus === 'attending' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            {entry.attendanceStatus === 'attending' ? 'Confirmado' : 'No asiste'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{entry.dietaryRestrictions || '—'}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(entry.createdAt)}</td>
                        <td className="px-4 py-3">
                          {entry.message && (
                            <button
                              type="button"
                              onClick={() => setOpenMessageFor(openMessageFor === entry.id ? null : entry.id)}
                              aria-label="Ver mensaje"
                              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                                openMessageFor === entry.id ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                              }`}
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                      {openMessageFor === entry.id && entry.message && (
                        <tr>
                          <td colSpan={6} className="px-4 pb-3 -mt-1">
                            <p className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-xl p-3 italic">
                              "{entry.message}"
                            </p>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* GESTIÓN MANUAL: lista propia del organizador, sin matching con lo de arriba */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Gestión manual</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Tu propia lista de invitados, para organizarte. No se cruza con las respuestas del formulario.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="uppercase px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-normal rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="uppercase px-3 py-2 bg-gray-900 hover:bg-black text-white text-xs font-normal rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar invitado</span>
            </button>
          </div>
        </div>

        {importFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900">
            {importFeedback}
          </div>
        )}

        {manualGuests.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-8 text-center">
            <p className="text-sm text-gray-500">Todavía no cargaste invitados. Agregalos a mano o importá un CSV.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-[11px] uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 font-semibold">Nombre</th>
                    <th className="px-4 py-3 font-semibold">Apellido</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                    <th className="px-4 py-3 font-semibold w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {manualGuests.map((g) => {
                    const meta = manualStatusMeta[g.status];
                    const StatusIcon = meta.icon;
                    return (
                      <tr key={g.id} className="text-gray-800">
                        <td className="px-4 py-3 font-medium">{g.firstName}</td>
                        <td className="px-4 py-3">{g.lastName}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => onUpdateManualGuestStatus(g.id, nextManualStatus[g.status])}
                            title="Tocá para cambiar el estado"
                            className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-semibold cursor-pointer transition-colors ${meta.className}`}
                          >
                            <StatusIcon className="w-3 h-3" strokeWidth={2.5} />
                            {meta.label}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => onDeleteManualGuest(g.id)}
                            aria-label="Eliminar invitado"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
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
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-100 animate-fade-in space-y-5">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Estado</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['pendiente', 'confirmado', 'no-asiste'] as ManualGuestStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`py-2 rounded-xl text-[11px] font-semibold uppercase cursor-pointer transition-colors border ${
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
                className="uppercase w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-normal cursor-pointer transition-colors"
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
