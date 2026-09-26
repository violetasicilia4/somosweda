import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { DurationMonths, WeddingData } from '../../types';
import { durationOptions } from '../../data/initialData';
import { addMonths, formatARS, formatLongDate } from '../../utils/format';
import { DurationPicker } from './DurationPicker';

interface DurationViewProps {
  wedding: WeddingData;
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
  onPublish: () => void;
}

export const DurationView: React.FC<DurationViewProps> = ({ wedding, onUpdateWedding, onPublish }) => {
  const months: DurationMonths = wedding.durationMonths ?? 12;
  const isPublished = wedding.status === 'PUBLICADO';
  const chosen = durationOptions.find((o) => o.months === months) ?? durationOptions[1];
  const activeUntil =
    isPublished && wedding.publishedAt ? addMonths(new Date(wedding.publishedAt), months) : null;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isPublished ? 'Publicado' : 'Borrador'}</span>
        </div>

        {isPublished ? (
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Tu lista está activa hasta el {activeUntil ? formatLongDate(activeUntil) : '—'}.
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Elegiste {months} meses ({formatARS(chosen.price)}). Pagaste una sola vez, sin suscripción.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Elegí por cuánto tiempo</h3>
              <p className="text-sm text-gray-600 mt-1 max-w-xl">
                Elegí por cuánto tiempo querés que tu lista esté activa. Es un pago único, sin suscripción.
              </p>
            </div>

            <DurationPicker value={months} onChange={(m) => onUpdateWedding({ durationMonths: m })} />

            <div className="pt-1">
              <button
                type="button"
                onClick={onPublish}
                className="uppercase px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-normal cursor-pointer transition-colors"
              >
                Publicar tu lista
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
