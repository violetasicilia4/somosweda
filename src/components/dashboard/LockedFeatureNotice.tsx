import React from 'react';
import { WeddingData, WeddingPlan } from '../../types';
import { getPlanDetails, getHighestPlan, planRank } from '../../utils/plan';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface LockedFeatureNoticeProps {
  wedding: WeddingData;
  requiredPlan: WeddingPlan;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onSelectPlan: (plan: WeddingPlan) => void;
}

// Pantalla que reemplaza el contenido de una pestaña cuando el plan actual no la
// incluye. Nunca dice "bloqueado" ni muestra precio: si la pareja ya había probado ese
// plan y bajó, ofrece "restaurar" (su configuración sigue guardada); si nunca lo probó,
// invita a probarlo. En los dos casos, el cambio de plan es instantáneo y gratis — el
// pago real sólo pasa al publicar.
export const LockedFeatureNotice: React.FC<LockedFeatureNoticeProps> = ({
  wedding,
  requiredPlan,
  icon: Icon,
  title,
  description,
  onSelectPlan,
}) => {
  const plan = getPlanDetails(requiredPlan);
  const highestEver = getHighestPlan(wedding);
  const alreadyConfigured = planRank(highestEver) >= planRank(requiredPlan);

  return (
    <div className="flex flex-col items-center text-center max-w-md mx-auto py-16 sm:py-20 animate-fade-in">
      <span className="w-14 h-14 rounded-3xl bg-gray-900 text-white flex items-center justify-center mb-5">
        <Icon className="w-6 h-6" />
      </span>

      <h2 className="text-xl sm:text-2xl font-normal text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>

      {alreadyConfigured && (
        <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tu configuración fue guardada</span>
        </div>
      )}

      <button
        type="button"
        onClick={() => onSelectPlan(requiredPlan)}
        className="uppercase mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl text-xs font-normal transition-colors cursor-pointer shadow-xs"
      >
        <Sparkles className="w-4 h-4" />
        <span>{alreadyConfigured ? `Restaurar ${plan.name}` : `Probar ${plan.name}`}</span>
      </button>

      <p className="text-[11px] text-gray-400 mt-3">
        Sin tarjeta de crédito · Sin compromiso · Pagás solo al publicar
      </p>
    </div>
  );
};
