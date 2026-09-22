import React, { useState } from 'react';
import { Guest, WeddingData, WeddingTable } from '../../types';
import { initialTables } from '../../data/initialData';
import { 
  Users, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Utensils, 
  Share2, 
  Trash2, 
  Send, 
  Copy, 
  Check, 
  Sparkles,
  LayoutGrid,
  Filter,
  MessageCircle
} from 'lucide-react';

interface GuestManagementViewProps {
  wedding: WeddingData;
  guests: Guest[];
  onAddGuest: (guest: Omit<Guest, 'id'>) => void;
  onUpdateGuestStatus: (guestId: string, status: Guest['status']) => void;
  onDeleteGuest: (guestId: string) => void;
  onUpdateGuest?: (guestId: string, updates: Partial<Guest>) => void;
}

export const GuestManagementView: React.FC<GuestManagementViewProps> = ({
  wedding,
  guests,
  onAddGuest,
  onUpdateGuestStatus,
  onDeleteGuest,
}) => {
  const [internalTab, setInternalTab] = useState<'lista' | 'mesas'>('lista');

  // Search & Filters for Lista
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmado' | 'pendiente' | 'rechazado'>('all');

  // Add guest modal state
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companionsCount, setCompanionsCount] = useState('0');
  const [dietaryRequirement, setDietaryRequirement] = useState('');
  const [tableAssigned, setTableAssigned] = useState('Sin asignar');

  // Tables state
  const [tables, setTables] = useState<WeddingTable[]>(initialTables);
  const [newTableName, setNewTableName] = useState('');
  const [newTableCapacity, setNewTableCapacity] = useState('10');
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);

  // Derived metrics
  const totalGuestsAndCompanions = guests.reduce((acc, g) => acc + 1 + (g.companionsCount || 0), 0);
  const confirmedCount = guests.filter(g => g.status === 'confirmado').length;
  const confirmedCompanions = guests
    .filter(g => g.status === 'confirmado')
    .reduce((acc, g) => acc + 1 + (g.companionsCount || 0), 0);
  const pendingCount = guests.filter(g => g.status === 'pendiente').length;
  const declinedCount = guests.filter(g => g.status === 'rechazado').length;

  // Filtered guests
  const filteredGuests = guests.filter(g => {
    const matchesSearch = 
      g.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.email && g.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.phone && g.phone.includes(searchQuery)) ||
      (g.tableAssigned && g.tableAssigned.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (g.dietaryRequirement && g.dietaryRequirement.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return g.status === statusFilter;
  });

  // Handle Add Guest
  const handleCreateGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    onAddGuest({
      fullName: fullName.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      companionsCount: parseInt(companionsCount) || 0,
      status: 'pendiente',
      dietaryRequirement: dietaryRequirement.trim() || undefined,
      tableAssigned: tableAssigned !== 'Sin asignar' ? tableAssigned : undefined,
      invitationSent: false,
    });

    setFullName('');
    setEmail('');
    setPhone('');
    setCompanionsCount('0');
    setDietaryRequirement('');
    setIsAddGuestModalOpen(false);
  };

  // Handle Add Table
  const handleCreateTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableName.trim()) return;

    const newT: WeddingTable = {
      id: `t_${Date.now()}`,
      name: newTableName.trim(),
      capacity: parseInt(newTableCapacity) || 10,
    };
    setTables(prev => [...prev, newT]);
    setNewTableName('');
    setIsAddTableOpen(false);
  };

  // WhatsApp invitation or reminder message
  const handleSendWhatsApp = (guest: Guest) => {
    const isPending = guest.status === 'pendiente';
    const text = isPending
      ? `¡Hola ${guest.fullName}! Te recordamos confirmar tu asistencia para la boda de ${wedding.coupleName} el ${wedding.weddingDate} en: https://weda.app/boda/${wedding.slug}. ¡Nos encantaría contar con tu presencia!`
      : `¡Hola ${guest.fullName}! Te compartimos los detalles de nuestra boda (${wedding.coupleName}) en: https://weda.app/boda/${wedding.slug}`;
    const url = guest.phone 
      ? `https://wa.me/${guest.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-gray-900">
            Invitados & Mesas
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestioná la lista completa, el seguimiento de confirmaciones RSVP, distribución de mesas y dietas especiales.
          </p>
        </div>

        <button
          onClick={() => setIsAddGuestModalOpen(true)}
          className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Agregar invitado</span>
        </button>
      </div>

      {/* INTERNAL TABS: 1. Invitados & RSVP | 2. Mesas */}
      <div className="flex border-b border-gray-200 gap-8 overflow-x-auto">
        <button
          onClick={() => setInternalTab('lista')}
          className={`pb-3.5 text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            internalTab === 'lista'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Invitados & RSVP</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            {guests.length}
          </span>
        </button>

        <button
          onClick={() => setInternalTab('mesas')}
          className={`pb-3.5 text-sm font-semibold transition-all relative cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            internalTab === 'mesas'
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>Distribución de Mesas</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-normal text-gray-400">
            ({tables.length})
          </span>
          <span className="text-[9px] font-bold uppercase tracking-wide text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">
            Desde Signature
          </span>
        </button>
      </div>

      {/* ================= TAB 1: LISTA ================= */}
      {internalTab === 'lista' && (
        <div className="space-y-4">
          {/* Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Total invitados
              </span>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 block font-mono">
                {totalGuestsAndCompanions}
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5 block">{guests.length} titulares</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Confirmados
              </span>
              <span className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 block font-mono">
                {confirmedCompanions}
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5 block">{confirmedCount} invitaciones</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                Pendientes
              </span>
              <span className="text-xl sm:text-2xl font-bold text-amber-700 mt-1 block font-mono">
                {pendingCount}
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5 block">Por responder</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
                No asisten
              </span>
              <span className="text-xl sm:text-2xl font-bold text-gray-400 mt-1 block font-mono">
                {declinedCount}
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5 block">Rechazados</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o mesa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  statusFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todos ({guests.length})
              </button>
              <button
                onClick={() => setStatusFilter('confirmado')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  statusFilter === 'confirmado' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                Confirmados ({confirmedCount})
              </button>
              <button
                onClick={() => setStatusFilter('pendiente')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  statusFilter === 'pendiente' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                Pendientes ({pendingCount})
              </button>
            </div>
          </div>

          {/* Guests Cards (Linear/Notion-like list, NOT giant excel table) */}
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-2xs">
            {filteredGuests.map((guest) => (
              <div 
                key={guest.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/70 transition-colors"
              >
                {/* Left: Guest info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-sm text-gray-700 shrink-0">
                    {guest.fullName.charAt(0)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900">{guest.fullName}</h4>
                      {guest.companionsCount > 0 && (
                        <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.2 rounded-full font-medium">
                          +{guest.companionsCount} acompañante{guest.companionsCount > 1 ? 's' : ''}
                        </span>
                      )}

                      {/* Status indicator */}
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 ${
                        guest.status === 'confirmado'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : guest.status === 'pendiente'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {guest.status === 'confirmado' && <CheckCircle2 className="w-3 h-3" />}
                        {guest.status === 'pendiente' && <Clock className="w-3 h-3" />}
                        {guest.status === 'rechazado' && <XCircle className="w-3 h-3" />}
                        <span className="capitalize">{guest.status}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      {guest.phone && <span>{guest.phone}</span>}
                      {guest.email && <span>• {guest.email}</span>}
                      {guest.tableAssigned && (
                        <span className="text-gray-700 font-medium">
                          • {guest.tableAssigned}
                        </span>
                      )}
                      {guest.dietaryRequirement && (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.2 rounded font-medium flex items-center gap-1">
                          <Utensils className="w-3 h-3" />
                          {guest.dietaryRequirement}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleSendWhatsApp(guest)}
                    title="Enviar invitación personalizada por WhatsApp"
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  <select
                    value={guest.status}
                    onChange={(e) => onUpdateGuestStatus(guest.id, e.target.value as Guest['status'])}
                    className="text-xs border border-gray-200 bg-white rounded-lg px-2.5 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer"
                  >
                    <option value="confirmado">Confirmado</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="rechazado">Rechazado</option>
                  </select>

                  <button
                    onClick={() => onDeleteGuest(guest.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Eliminar invitado"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredGuests.length === 0 && (
              <div className="text-center py-12 p-8 space-y-2">
                <Users className="w-8 h-8 text-gray-300 mx-auto" />
                <h4 className="text-sm font-bold text-gray-800">No hay invitados en esta búsqueda</h4>
                <p className="text-xs text-gray-500">
                  Probá ajustando el filtro o agregando un nuevo invitado a la lista.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: MESAS (SEATING PLANNER - MINIMIZED / NON-PROTAGONIST) ================= */}
      {internalTab === 'mesas' && (
        <div className="space-y-6">
          {/* Subtle educational notice when confirmed count is low */}
          {confirmedCount < 20 && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                  Distribución de mesas (Recomendado con más confirmados)
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Es ideal armar las mesas definitivas cuando cuentes con un grupo representativo de confirmados (actualmente tenés {confirmedCount} confirmados). Mientras tanto, podés pre-configurar tus mesas a continuación.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-lg font-medium text-gray-900">Distribución de Mesas</h3>
              <p className="text-xs text-gray-500">
                Organizá a los invitados confirmados por afinidad familiar y de amigos.
              </p>
            </div>

            <button
              onClick={() => setIsAddTableOpen(true)}
              className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>+ Nueva mesa</span>
            </button>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tables.map((table) => {
              const assignedGuests = guests.filter(g => g.tableAssigned === table.name);
              const assignedSeats = assignedGuests.reduce((acc, g) => acc + 1 + (g.companionsCount || 0), 0);

              return (
                <div 
                  key={table.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-gray-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{table.name}</h4>
                        {table.notes && <p className="text-[11px] text-gray-400">{table.notes}</p>}
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                        assignedSeats > table.capacity
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {assignedSeats} / {table.capacity} lugares
                      </span>
                    </div>

                    {/* Guest list inside table */}
                    <div className="space-y-1 pt-1">
                      {assignedGuests.map(g => (
                        <div key={g.id} className="text-xs text-gray-700 flex items-center justify-between py-1 border-b border-gray-50">
                          <span className="font-medium truncate">{g.fullName}</span>
                          {g.companionsCount > 0 && (
                            <span className="text-[10px] text-gray-400 font-mono">+{g.companionsCount}</span>
                          )}
                        </div>
                      ))}

                      {assignedGuests.length === 0 && (
                        <div className="text-xs text-gray-400 italic py-2">
                          Mesa vacía. Podés asignar invitados desde la lista principal.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>Capacidad max: {table.capacity}</span>
                    <span className="text-emerald-700 font-semibold">
                      {table.capacity - assignedSeats} libres
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: AGREGAR INVITADO */}
      {isAddGuestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100 animate-fade-in space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-serif font-medium text-base text-gray-900">+ Agregar invitado</h3>
              <button 
                onClick={() => setIsAddGuestModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xs font-semibold p-1"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleCreateGuest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Carolina Mendonça"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    WhatsApp / Teléfono
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+54 9 11 5555-1234"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Acompañantes
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={companionsCount}
                    onChange={(e) => setCompanionsCount(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carolina@ejemplo.com"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Restricción dietaria
                  </label>
                  <input
                    type="text"
                    value={dietaryRequirement}
                    onChange={(e) => setDietaryRequirement(e.target.value)}
                    placeholder="Celíaco, Vegetariano..."
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Asignar a Mesa
                  </label>
                  <select
                    value={tableAssigned}
                    onChange={(e) => setTableAssigned(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    <option value="Sin asignar">Sin asignar</option>
                    {tables.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGuestModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Guardar invitado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVA MESA */}
      {isAddTableOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-gray-100 animate-fade-in space-y-4">
            <h3 className="font-serif font-medium text-base text-gray-900">+ Crear nueva mesa</h3>
            <form onSubmit={handleCreateTable} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nombre de la mesa
                </label>
                <input
                  type="text"
                  required
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="Ej. Mesa 6 - Primos del Sur"
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Capacidad de personas
                </label>
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={newTableCapacity}
                  onChange={(e) => setNewTableCapacity(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTableOpen(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gray-900 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Crear mesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
