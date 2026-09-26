import React, { useState } from 'react';
import { WeddingData, CuentaSection } from '../../types';
import { Check } from 'lucide-react';
import { formatLongDate } from '../../utils/format';
import { CobrosView } from './CobrosView';
import { DurationView } from './DurationView';

interface AccountViewProps {
  wedding: WeddingData;
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
  section: CuentaSection;
  onSectionChange: (section: CuentaSection) => void;
  onPublish: () => void;
}

const SECTIONS: { id: CuentaSection; label: string }[] = [
  { id: 'datos', label: 'Datos de la boda' },
  { id: 'cobro', label: 'Cuenta de cobro' },
  { id: 'duracion', label: 'Duración' },
];

export const AccountView: React.FC<AccountViewProps> = ({
  wedding,
  onUpdateWedding,
  section,
  onSectionChange,
  onPublish,
}) => {
  const [partner1, setPartner1] = useState(wedding.partner1);
  const [partner2, setPartner2] = useState(wedding.partner2);
  const [weddingDate, setWeddingDate] = useState(wedding.weddingDate);
  const [venue, setVenue] = useState(wedding.venue);
  const [city, setCity] = useState(wedding.city);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWedding({
      partner1,
      partner2,
      coupleName: `${partner1} & ${partner2}`,
      weddingDate,
      venue,
      city,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h2 className="text-2xl sm:text-3xl font-normal text-gray-900">
          Cuenta
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Los datos de tu boda, dónde recibís el dinero y por cuánto tiempo está activa tu lista.
        </p>
      </div>

      <div className="flex items-center gap-6 border-b border-gray-200 overflow-x-auto">
        {SECTIONS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onSectionChange(t.id)}
            className={`pb-3.5 text-xs font-normal uppercase transition-all cursor-pointer whitespace-nowrap ${
              section === t.id ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {section === 'cobro' && <CobrosView wedding={wedding} onUpdateWedding={onUpdateWedding} hideTitle />}

      {section === 'duracion' && (
        <DurationView wedding={wedding} onUpdateWedding={onUpdateWedding} onPublish={onPublish} />
      )}

      {section === 'datos' && (
        <>

      {/* PROFILE HEADER */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex items-center gap-4">
        <img
          src={wedding.bannerImage}
          alt={wedding.coupleName}
          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-200"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-gray-900 truncate">{wedding.coupleName}</h3>
          <p className="text-xs text-gray-500 truncate">
            {formatLongDate(wedding.weddingDate)}{wedding.venue ? ` · ${wedding.venue}` : ''}
          </p>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
          wedding.status === 'PUBLICADO'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {wedding.status === 'PUBLICADO' ? 'Publicada' : 'Borrador'}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        {savedSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Datos actualizados con éxito.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nombre 1
              </label>
              <input
                type="text"
                required
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Nombre 2
              </label>
              <input
                type="text"
                required
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Fecha de la boda
              </label>
              <input
                type="date"
                required
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Ciudad / Provincia
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Lugar / Quinta / Salón
            </label>
            <input
              type="text"
              required
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="uppercase px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs sm:text-xs font-normal cursor-pointer shadow-xs"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>

        </>
      )}
    </div>
  );
};
