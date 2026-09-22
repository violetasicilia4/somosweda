import React, { useState } from 'react';
import { ReceivedGift } from '../../types';
import { Heart, Check, Search, FileText } from 'lucide-react';

interface ReceivedGiftsViewProps {
  receivedGifts: ReceivedGift[];
  onUpdateReceivedGift: (giftId: string, updates: Partial<ReceivedGift>) => void;
}

export const ReceivedGiftsView: React.FC<ReceivedGiftsViewProps> = ({
  receivedGifts,
  onUpdateReceivedGift,
}) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pendientes' | 'sin-agradecer'>('all');

  // Thank You modal state
  const [activeThankGift, setActiveThankGift] = useState<ReceivedGift | null>(null);
  const [thankYouText, setThankYouText] = useState('');

  // Receipt modal state
  const [activeReceiptGift, setActiveReceiptGift] = useState<ReceivedGift | null>(null);

  const filteredReceived = receivedGifts.filter((r) => {
    const match =
      r.giverName.toLowerCase().includes(search.toLowerCase()) ||
      r.giftTitle.toLowerCase().includes(search.toLowerCase()) ||
      (r.dedicationMessage && r.dedicationMessage.toLowerCase().includes(search.toLowerCase()));
    if (!match) return false;
    if (filter === 'pendientes') return r.status === 'pendiente';
    if (filter === 'sin-agradecer') return !r.isThanked;
    return true;
  });

  const handleOpenThankYou = (gift: ReceivedGift) => {
    setActiveThankGift(gift);
    setThankYouText(
      gift.thankYouMessage ||
      `¡Muchas gracias ${gift.giverName}! Nos emocionó muchísimo tu regalo para nuestra boda. Te mandamos un abrazo gigante.`
    );
  };

  const handleSaveThankYou = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThankGift) return;

    onUpdateReceivedGift(activeThankGift.id, {
      isThanked: true,
      thankYouMessage: thankYouText,
    });

    const phone = activeThankGift.giverPhone ? activeThankGift.giverPhone.replace(/[^0-9]/g, '') : '';
    const textEncoded = encodeURIComponent(thankYouText);
    const url = phone ? `https://wa.me/${phone}?text=${textEncoded}` : `https://wa.me/?text=${textEncoded}`;
    window.open(url, '_blank');

    setActiveThankGift(null);
  };

  const handleConfirmReceiptPayment = () => {
    if (activeReceiptGift) {
      onUpdateReceivedGift(activeReceiptGift.id, { status: 'confirmado' });
      setActiveReceiptGift(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Regalos recibidos</h2>
        <p className="text-sm text-gray-500 mt-1">
          Seguimiento de aportes, dedicatorias y agradecimientos.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o regalo..."
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>
        <div className="flex gap-2">
          {([
            { id: 'all', label: 'Todos' },
            { id: 'pendientes', label: 'Pendientes' },
            { id: 'sin-agradecer', label: 'Sin agradecer' },
          ] as const).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilter(opt.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                filter === opt.id ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs">
        {receivedGifts.length === 0 ? (
          <p className="text-xs sm:text-sm text-gray-500 text-center py-12 px-6">
            Cuando sus invitados hagan un regalo o dejen una dedicatoria, aparecerán aquí para que puedan darles las gracias.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredReceived.map((rec) => (
              <div key={rec.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{rec.giverName}</p>
                  <p className="text-xs text-gray-500">
                    Regaló: <span className="font-semibold text-gray-700">{rec.giftTitle}</span> (${rec.amount.toLocaleString()})
                  </p>
                  {rec.dedicationMessage && (
                    <p className="text-xs italic text-gray-600 bg-gray-50 p-2 rounded-lg mt-1 border border-gray-100 max-w-lg">
                      "{rec.dedicationMessage}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {rec.method === 'transferencia' && (
                    <button
                      type="button"
                      onClick={() => setActiveReceiptGift(rec)}
                      className="px-2.5 py-1 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Comprobante</span>
                    </button>
                  )}
                  {rec.isThanked ? (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Agradecido ✓
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenThankYou(rec)}
                      className="px-2.5 py-1 bg-gray-900 text-white rounded-lg text-xs font-semibold cursor-pointer hover:bg-black transition-colors"
                    >
                      Agradecer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: ENVIAR AGRADECIMIENTO */}
      {activeThankGift && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 animate-fade-in space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 block">
                  Agradecimiento a
                </span>
                <h3 className="font-bold text-base text-gray-900">{activeThankGift.giverName}</h3>
              </div>
              <button
                onClick={() => setActiveThankGift(null)}
                className="text-gray-400 hover:text-gray-700 text-xs font-semibold p-1"
              >
                Cerrar
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200/70 p-3.5 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Regalo: <strong>{activeThankGift.giftTitle}</strong></span>
                <span className="font-bold text-gray-900 font-mono">AR$ {activeThankGift.amount.toLocaleString()}</span>
              </div>
              {activeThankGift.dedicationMessage && (
                <div className="pt-2 border-t border-gray-200/50 text-gray-700 italic">
                  "{activeThankGift.dedicationMessage}"
                </div>
              )}
            </div>

            <form onSubmit={handleSaveThankYou} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Tu mensaje de agradecimiento
                </label>
                <textarea
                  rows={4}
                  required
                  value={thankYouText}
                  onChange={(e) => setThankYouText(e.target.value)}
                  placeholder="¡Muchas gracias por acompañarnos y por este hermoso regalo!..."
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveThankGift(null)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Guardar y enviar por WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VER COMPROBANTE */}
      {activeReceiptGift && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 animate-fade-in space-y-4">
            <div className="flex justify-between items-start pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                  Comprobante de transferencia
                </span>
                <h3 className="font-bold text-base text-gray-900">
                  {activeReceiptGift.giverName} • AR$ {activeReceiptGift.amount.toLocaleString()}
                </h3>
              </div>
              <button
                onClick={() => setActiveReceiptGift(null)}
                className="text-gray-400 hover:text-gray-700 text-xs font-semibold p-1"
              >
                Cerrar
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 max-h-80 flex items-center justify-center">
              <img
                src={activeReceiptGift.receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'}
                alt="Comprobante"
                className="max-h-80 object-contain w-full"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="text-xs text-gray-500 flex justify-between items-center pt-1">
              <span>Archivo: {activeReceiptGift.receiptFileName || 'comprobante.pdf'}</span>
              <span>Fecha: {activeReceiptGift.date}</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveReceiptGift(null)}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
              {activeReceiptGift.status === 'pendiente' && (
                <button
                  type="button"
                  onClick={handleConfirmReceiptPayment}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirmar acreditación en banco</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
