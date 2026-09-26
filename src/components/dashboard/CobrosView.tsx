import React, { useState } from 'react';
import { WeddingData } from '../../types';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface CobrosViewProps {
  wedding: WeddingData;
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
  // Modo embebido (p.ej. dentro del modal de publicación): sin título propio
  // ni el ancho de una pantalla completa.
  compact?: boolean;
  hideTitle?: boolean;
}

export const CobrosView: React.FC<CobrosViewProps> = ({ wedding, onUpdateWedding, compact = false, hideTitle = false }) => {
  const [bankAlias, setBankAlias] = useState(wedding.bankAlias || '');
  const [bankCbu, setBankCbu] = useState(wedding.bankCbu || '');
  const [bankHolder, setBankHolder] = useState(wedding.bankHolder || '');
  const [mpAlias, setMpAlias] = useState(wedding.mercadoPagoAlias || '');
  const [configSaved, setConfigSaved] = useState(false);
  const [errors, setErrors] = useState<{ alias?: string; cbu?: string }>({});

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { alias?: string; cbu?: string } = {};
    const cbuDigits = bankCbu.replace(/\s/g, '');
    if (cbuDigits && !/^\d{22}$/.test(cbuDigits)) nextErrors.cbu = 'El CBU tiene 22 dígitos.';
    const alias = bankAlias.trim();
    if (alias && !/^[A-Za-z0-9.\-]{6,20}$/.test(alias)) {
      nextErrors.alias = 'El alias tiene entre 6 y 20 caracteres (letras, números, punto o guion).';
    }
    if (!alias && !cbuDigits && !mpAlias.trim()) {
      nextErrors.alias = 'Cargá al menos un alias, un CBU o tu alias de Mercado Pago.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onUpdateWedding({
      bankAlias: alias,
      bankCbu: cbuDigits,
      bankHolder,
      mercadoPagoAlias: mpAlias,
      isPaymentConfigured: true,
    });
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000);
  };

  return (
    <div className={`space-y-6 animate-fade-in ${compact ? '' : 'max-w-2xl'}`}>
      {!compact && !hideTitle && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900">Cuenta de cobro</h2>
          <p className="text-sm text-gray-500 mt-1">
            ¿Dónde recibís el dinero de los regalos? (Mercado Pago o transferencia bancaria)
          </p>
        </div>
      )}

      <div className={`bg-white rounded-2xl border border-gray-200 space-y-5 ${compact ? 'p-4 sm:p-5' : 'p-6 sm:p-8 shadow-xs'}`}>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Weda nunca toca tu dinero: tus invitados transfieren directo a tu cuenta, sin comisión por regalo.</span>
        </div>

        {configSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Cuenta de cobro guardada.</span>
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alias Bancario
              </label>
              <input
                type="text"
                value={bankAlias}
                onChange={(e) => setBankAlias(e.target.value)}
                placeholder="ej: boda.milagros.juan"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              {errors.alias && <p className="text-[11px] text-rose-600 mt-1">{errors.alias}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                CBU Bancario
              </label>
              <input
                type="text"
                value={bankCbu}
                onChange={(e) => setBankCbu(e.target.value)}
                placeholder="22 dígitos"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
              {errors.cbu && <p className="text-[11px] text-rose-600 mt-1">{errors.cbu}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Titular de la cuenta
              </label>
              <input
                type="text"
                value={bankHolder}
                onChange={(e) => setBankHolder(e.target.value)}
                placeholder="Nombre y Apellido"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Alias Mercado Pago (opcional)
              </label>
              <input
                type="text"
                value={mpAlias}
                onChange={(e) => setMpAlias(e.target.value)}
                placeholder="ej: milagros.juan.mp"
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="uppercase px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-normal transition-all cursor-pointer"
            >
              Guardar cuenta de cobro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
