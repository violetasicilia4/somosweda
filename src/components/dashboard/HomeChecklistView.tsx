import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Lock, MessageCircle } from 'lucide-react';
import { CuentaSection, DashboardTab, Guest, GiftItem, ReceivedGift, WeddingData } from '../../types';
import { addMonths, formatARS, formatLongDate } from '../../utils/format';

interface HomeChecklistViewProps {
  wedding: WeddingData;
  gifts: GiftItem[];
  guests: Guest[];
  receivedGifts: ReceivedGift[];
  isPaymentConfigured: boolean;
  siteViewed: boolean;
  onGoTo: (tab: DashboardTab, section?: CuentaSection) => void;
  onOpenSite: () => void;
  onPublish: () => void;
}

type StepStatus = 'done' | 'progress' | 'pending' | 'blocked';

interface Step {
  id: number;
  title: string;
  description: string;
  detail?: string;
  status: StepStatus;
  cta: string;
  action: () => void;
}

const MIN_GIFTS = 5;

export const HomeChecklistView: React.FC<HomeChecklistViewProps> = ({
  wedding,
  gifts,
  guests,
  receivedGifts,
  isPaymentConfigured,
  siteViewed,
  onGoTo,
  onOpenSite,
  onPublish,
}) => {
  const [copied, setCopied] = useState(false);
  const isPublished = wedding.status === 'PUBLICADO';
  const siteUrl = `weda.app/boda/${wedding.slug}`;

  const giftsDone = gifts.length >= MIN_GIFTS;
  const publishBlocked = !(giftsDone && isPaymentConfigured);

  // Pasos obligatorios: la lista de regalos es el centro del onboarding.
  const steps: Step[] = [
    {
      id: 1,
      title: 'Creá tu lista de regalos',
      description: `Elegí qué quieren construir juntos: luna de miel, hogar, proyectos. Sumá al menos ${MIN_GIFTS} regalos.`,
      detail: gifts.length > 0 ? `${gifts.length} de ${MIN_GIFTS} regalos` : undefined,
      status: giftsDone ? 'done' : gifts.length > 0 ? 'progress' : 'pending',
      cta: gifts.length > 0 ? 'Seguir con mi lista' : 'Crear mi lista de regalos',
      action: () => onGoTo('regalos'),
    },
    {
      id: 2,
      title: 'Configurá dónde recibís el dinero',
      description: 'Mercado Pago o transferencia bancaria. Tus invitados pagan directo a tu cuenta.',
      status: isPaymentConfigured ? 'done' : 'pending',
      cta: 'Configurar cuenta de cobro',
      action: () => onGoTo('cuenta', 'cobro'),
    },
    {
      id: 3,
      title: 'Revisá cómo la ve un invitado',
      description: 'Abrí tu lista y mirá lo que van a ver tus invitados antes de publicar.',
      status: siteViewed ? 'done' : 'pending',
      cta: 'Ver tu lista',
      action: onOpenSite,
    },
    {
      id: 4,
      title: 'Publicá y compartí',
      description: isPublished
        ? 'Tu lista está en vivo.'
        : 'Elegí por cuánto tiempo querés tenerla activa y compartila con tus invitados.',
      detail: publishBlocked && !isPublished ? 'Primero completá los pasos 1 y 2.' : undefined,
      status: isPublished ? 'done' : publishBlocked ? 'blocked' : 'pending',
      cta: 'Publicar tu lista',
      action: onPublish,
    },
  ];

  // Complementos (opcionales): no bloquean la publicación.
  const hasEventInfo = Boolean(wedding.venue?.trim() || wedding.address?.trim());
  const extras = [
    {
      id: 'invitados',
      title: 'Cargá tus invitados',
      description: 'Sumalos para ver quién confirmó y quién ya regaló.',
      detail: guests.length > 0 ? `${guests.length} ${guests.length === 1 ? 'invitación' : 'invitaciones'}` : undefined,
      done: guests.length > 0,
      cta: guests.length > 0 ? 'Editar' : 'Agregar invitados',
      action: () => onGoTo('invitados'),
    },
    {
      id: 'evento',
      title: 'Sumá la información del evento',
      description: 'Lugar, horarios y datos importantes para tus invitados.',
      detail: undefined,
      done: hasEventInfo,
      cta: hasEventInfo ? 'Editar' : 'Agregar información',
      action: () => onGoTo('sitio'),
    },
  ];

  const doneCount = steps.filter((s) => s.status === 'done').length;
  const remaining = steps.length - doneCount;
  const nextStep = steps.find((s) => s.status !== 'done' && s.status !== 'blocked');
  const percent = Math.round((doneCount / steps.length) * 100);

  const handleCopy = () => {
    navigator.clipboard?.writeText(`https://${siteUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `Esta es nuestra lista de regalos. Elegí lo que quieras regalarnos: https://${siteUrl}`
  )}`;

  const confirmed = guests.filter((g) => g.status === 'confirmado').length;
  const pendingThanks = receivedGifts.filter((r) => !r.isThanked).length;
  const totalReceived = receivedGifts.reduce((sum, r) => sum + r.amount, 0);
  const activeUntil =
    wedding.publishedAt && wedding.durationMonths
      ? addMonths(new Date(wedding.publishedAt), wedding.durationMonths)
      : null;

  const statusIcon = (status: StepStatus, id: number) => {
    if (status === 'done') {
      return (
        <span className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center shrink-0">
          <Check className="w-4 h-4" strokeWidth={2.25} />
        </span>
      );
    }
    if (status === 'blocked') {
      return (
        <span className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 flex items-center justify-center shrink-0">
          <Lock className="w-3.5 h-3.5" />
        </span>
      );
    }
    return (
      <span
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 text-[11px] font-semibold ${
          status === 'progress' ? 'border-gray-900 text-gray-900 bg-gray-100' : 'border-gray-300 text-gray-400'
        }`}
      >
        {id}
      </span>
    );
  };

  const statusLabel: Record<StepStatus, string> = {
    done: 'Completo',
    progress: 'En curso',
    pending: 'Pendiente',
    blocked: 'Bloqueado',
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl pb-24">
      {/* ENCABEZADO */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-normal text-gray-900">
          {isPublished ? 'Tu lista está publicada.' : `Hola, ${wedding.partner1}.`}
        </h2>
        {isPublished ? (
          <p className="text-sm text-gray-600 mt-1">
            {activeUntil
              ? `Tu lista está activa hasta el ${formatLongDate(activeUntil)}.`
              : 'Tu lista está activa y lista para recibir regalos.'}
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mt-1">
              Tu lista de regalos está en borrador. {remaining === 1 ? 'Te falta 1 paso' : `Te faltan ${remaining} pasos`} para publicarla.
            </p>
            <p className="text-xs text-gray-500 mt-1">Tu lista es privada: solo vos la ves hasta que la publiques.</p>
          </>
        )}
      </div>

      {/* SEGUIMIENTO (solo publicado) */}
      {isPublished && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Regalos recibidos</span>
              <span className="text-2xl font-bold text-gray-900 mt-2 block">{receivedGifts.length}</span>
              <span className="text-xs text-gray-500">{formatARS(totalReceived)}</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Por agradecer</span>
              <span className="text-2xl font-bold text-gray-900 mt-2 block">{pendingThanks}</span>
              <span className="text-xs text-gray-500">regalos</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Confirmaron</span>
              <span className="text-2xl font-bold text-gray-900 mt-2 block">
                {confirmed} de {guests.length}
              </span>
              <span className="text-xs text-gray-500">invitaciones</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Tu enlace</span>
              <span className="text-sm font-semibold text-gray-900 truncate block">{siteUrl}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenSite}
                className="uppercase px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-normal rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ver tu lista</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="uppercase px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-normal rounded-xl inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Enlace copiado' : 'Copiar enlace'}</span>
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="uppercase px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-normal rounded-xl inline-flex items-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Compartir por WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* PROGRESO */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-gray-900">{doneCount} de {steps.length} completados</span>
          <span className="text-gray-500">{percent} %</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gray-900 transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {/* CHECKLIST */}
      <ol className="space-y-3">
        {steps.map((step) => {
          const isNext = nextStep?.id === step.id;
          return (
            <li
              key={step.id}
              className={`bg-white border rounded-2xl p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                isNext ? 'border-gray-900' : 'border-gray-200'
              } ${step.status === 'blocked' ? 'opacity-70' : ''}`}
            >
              {statusIcon(step.status, step.id)}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className={`text-sm font-semibold ${step.status === 'done' ? 'text-gray-500' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wide text-gray-400">{statusLabel[step.status]}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                {step.detail && (
                  <p className={`text-xs mt-1.5 ${step.status === 'blocked' ? 'text-gray-500' : 'font-semibold text-gray-700'}`}>
                    {step.detail}
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={step.status === 'blocked'}
                onClick={step.action}
                className={`uppercase shrink-0 px-3.5 py-2 text-xs font-normal rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  isNext
                    ? 'bg-gray-900 hover:bg-black text-white'
                    : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {step.status === 'done' && step.id !== 3 && step.id !== 4 ? 'Editar' : step.cta}
              </button>
            </li>
          );
        })}
      </ol>

      {/* COMPLEMENTOS (opcionales) */}
      <section className="space-y-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Complementos</h3>
          <p className="text-xs text-gray-500 mt-0.5">Opcionales: podés publicar tu lista sin completarlos.</p>
        </div>
        <ul className="space-y-2">
          {extras.map((x) => (
            <li key={x.id} className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  x.done ? 'bg-gray-900 text-white' : 'border border-gray-300'
                }`}
              >
                {x.done && <Check className="w-3 h-3" strokeWidth={2.5} />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{x.title}</p>
                <p className="text-xs text-gray-500">{x.detail ?? x.description}</p>
              </div>
              <button
                type="button"
                onClick={x.action}
                className="uppercase shrink-0 px-3 py-1.5 text-xs font-normal rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 cursor-pointer transition-colors"
              >
                {x.cta}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* BARRA FIJA: SIGUIENTE PASO */}
      {nextStep && (
        <div className="sticky bottom-4 z-20">
          <div className="bg-gray-900 text-white rounded-2xl px-4 sm:px-5 py-3 flex items-center justify-between gap-4">
            <p className="text-xs sm:text-sm min-w-0 truncate">
              <span className="text-white/60">Siguiente paso: </span>
              <span className="font-semibold">{nextStep.title}</span>
            </p>
            <button
              type="button"
              onClick={nextStep.action}
              className="uppercase shrink-0 px-3.5 py-2 bg-white text-gray-900 hover:bg-gray-100 text-xs font-normal rounded-xl cursor-pointer transition-colors"
            >
              {nextStep.cta} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
