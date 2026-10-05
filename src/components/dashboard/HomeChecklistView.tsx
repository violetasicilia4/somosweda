import React, { useState } from 'react';
import { ArrowRight, Check, Copy, CreditCard, ExternalLink, Lock, MessageCircle } from 'lucide-react';
import { CuentaSection, DashboardTab, GiftItem, ManualGuest, ReceivedGift, WeddingData } from '../../types';
import { formatARS } from '../../utils/format';
import { PLAN_LABELS, PLAN_PRICES, isPlanAtLeast } from '../../utils/plan';

interface HomeChecklistViewProps {
  wedding: WeddingData;
  gifts: GiftItem[];
  receivedGifts: ReceivedGift[];
  manualGuests: ManualGuest[];
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
  receivedGifts,
  manualGuests,
  isPaymentConfigured,
  siteViewed,
  onGoTo,
  onOpenSite,
  onPublish,
}) => {
  const [copied, setCopied] = useState(false);
  const isPublished = wedding.status === 'PUBLICADO';
  const siteUrl = `weda.app/boda/${wedding.slug}`;

  // El plan Lista de Regalos gira 100% en torno a la lista; Evento/Evento Plus suman
  // invitados y micrositio, así que este checklist (y el resto de la pantalla) tienen que
  // dejar de hablar solo de "tu lista" para esos planes, o la elección de plan que la
  // pareja hizo en el onboarding queda ignorada apenas entra al panel.
  const isEventPlan = isPlanAtLeast(wedding.plan, 'invitados-rsvp');
  const siteNoun = isEventPlan ? 'sitio' : 'lista';

  const giftsDone = gifts.length >= MIN_GIFTS;
  const publishBlocked = !(giftsDone && isPaymentConfigured);
  const guestsDone = manualGuests.length > 0;
  const siteCustomized = Boolean(wedding.venue?.trim() || wedding.address?.trim() || wedding.storyText?.trim());

  // Pasos obligatorios (regalos + cuenta de cobro: son los únicos que bloquean publicar,
  // en cualquier plan) más, solo para Evento/Evento Plus, los pasos de invitados y sitio.
  const baseSteps: Step[] = [
    {
      id: 1,
      title: 'Armá tu lista de regalos',
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
      // La cuenta de cobro vive dentro del módulo de Regalos.
      action: () => onGoTo('regalos'),
    },
  ];

  const eventSteps: Step[] = isEventPlan
    ? [
        {
          id: 3,
          title: 'Sumá tus invitados',
          description: 'Cargá tu lista uno por uno o importala desde Excel para llevar el conteo de confirmaciones.',
          detail: guestsDone ? `${manualGuests.length} invitados cargados` : undefined,
          status: guestsDone ? 'done' : 'pending',
          cta: guestsDone ? 'Ver invitados' : 'Cargar invitados',
          action: () => onGoTo('rsvp'),
        },
        {
          id: 4,
          title: 'Personalizá tu sitio',
          description: 'Contá su historia, sumá el cronograma del día y elegí qué secciones mostrar.',
          status: siteCustomized ? 'done' : 'pending',
          cta: siteCustomized ? 'Editar sitio' : 'Personalizar sitio',
          action: () => onGoTo('sitio'),
        },
      ]
    : [];

  const tailSteps: Step[] = [
    {
      id: eventSteps.length ? 5 : 3,
      title: isEventPlan ? 'Revisá cómo lo ve un invitado' : 'Revisá cómo la ve un invitado',
      description: isEventPlan
        ? 'Abrí tu sitio y mirá lo que van a ver tus invitados antes de publicar.'
        : 'Abrí tu lista y mirá lo que van a ver tus invitados antes de publicar.',
      status: siteViewed ? 'done' : 'pending',
      cta: isEventPlan ? 'Ver tu sitio' : 'Ver tu lista',
      action: onOpenSite,
    },
    {
      id: eventSteps.length ? 6 : 4,
      title: 'Publicá y compartí',
      description: isPublished
        ? `Tu ${siteNoun} está en vivo.`
        : `Pagá tu plan y compartí tu ${siteNoun} con tus invitados.`,
      detail: publishBlocked && !isPublished ? 'Primero completá los pasos 1 y 2.' : undefined,
      status: isPublished ? 'done' : publishBlocked ? 'blocked' : 'pending',
      cta: isPublished ? `Ver ${siteNoun} publicad${isEventPlan ? 'o' : 'a'}` : isEventPlan ? 'Publicar tu sitio' : 'Publicar tu lista',
      action: isPublished ? onOpenSite : onPublish,
    },
  ];

  const steps: Step[] = [...baseSteps, ...eventSteps, ...tailSteps];
  // Los dos últimos pasos ("revisá cómo lo ve un invitado" y "publicá") son acciones de
  // ver/publicar, no formularios editables — nunca deberían mostrar "Editar" aunque ya
  // estén completos, a diferencia de los pasos anteriores (regalos, cobro, invitados,
  // sitio) donde "Editar" sí tiene sentido una vez hechos.
  const viewOrPublishStepIds = new Set(tailSteps.map((s) => s.id));

  // Complementos (opcionales): no bloquean la publicación. Para Evento/Evento Plus, la
  // info del evento ya se carga como parte del paso "Personalizá tu sitio" de arriba, así
  // que este complemento solo tiene sentido para el plan Lista de Regalos.
  const hasEventInfo = Boolean(wedding.venue?.trim() || wedding.address?.trim());
  const extras = isEventPlan
    ? []
    : [
        {
          id: 'evento',
          title: 'Sumá la información del evento',
          description: 'Lugar, horarios y datos importantes para quienes te regalan.',
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
    isEventPlan
      ? `Este es nuestro sitio de casamiento. Confirmá tu asistencia y elegí tu regalo: https://${siteUrl}`
      : `Esta es nuestra lista de regalos. Elegí lo que quieras regalarnos: https://${siteUrl}`
  )}`;

  const currentPlan = wedding.plan ?? 'regalos';
  const planLabel = PLAN_LABELS[currentPlan];
  const planPrice = PLAN_PRICES[currentPlan];

  const pendingThanks = receivedGifts.filter((r) => !r.isThanked).length;
  const totalReceived = receivedGifts.reduce((sum, r) => sum + r.amount, 0);

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
          {isPublished ? `Tu ${siteNoun} está ${isEventPlan ? 'publicado' : 'publicada'}.` : `Hola, ${wedding.partner1}.`}
        </h2>
        {isPublished ? (
          <p className="text-sm text-gray-600 mt-1">
            Tu {siteNoun} está {isEventPlan ? 'activo' : 'activa'} {isEventPlan ? 'y listo' : 'y lista'} para recibir {isEventPlan ? 'invitados y regalos' : 'regalos'}.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mt-1">
              Tu {isEventPlan ? 'evento' : 'lista de regalos'} está en borrador. {remaining === 1 ? 'Te falta 1 paso' : `Te faltan ${remaining} pasos`} para publicar{isEventPlan ? 'lo' : 'la'}.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Tu {siteNoun} {isEventPlan ? 'es privado' : 'es privada'}: solo vos {isEventPlan ? 'lo ves' : 'la ves'} hasta que {isEventPlan ? 'lo publiques' : 'la publiques'}.
            </p>
          </>
        )}
      </div>

      {/* TU PLAN */}
      <section className="bg-white border border-gray-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Tu plan</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base font-bold text-gray-900">{planLabel}</span>
            <span className="text-xs text-gray-500">{planPrice} · pago único</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onGoTo('cuenta', 'plan')}
            className="uppercase px-3.5 min-h-11 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-normal rounded-2xl inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>Cambiar plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {!isPublished && (
            <button
              type="button"
              onClick={onPublish}
              className="uppercase px-3.5 min-h-11 bg-gray-900 hover:bg-black text-white text-xs font-normal rounded-2xl inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pagar y publicar</span>
            </button>
          )}
        </div>
      </section>

      {/* SEGUIMIENTO (solo publicado) */}
      {isPublished && (
        <section className="space-y-4">
          <div className={`grid grid-cols-1 sm:grid-cols-3 ${isEventPlan ? 'lg:grid-cols-4' : ''} gap-4`}>
            <div className="bg-white border border-gray-200 rounded-3xl p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Regalos recibidos</span>
              <span className="text-2xl font-bold text-gray-900 mt-2 block">{receivedGifts.length}</span>
              <span className="text-xs text-gray-500">{formatARS(totalReceived)}</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Por agradecer</span>
              <span className="text-2xl font-bold text-gray-900 mt-2 block">{pendingThanks}</span>
              <span className="text-xs text-gray-500">regalos</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-3xl p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">En tu lista</span>
              <span className="text-2xl font-bold text-gray-900 mt-2 block">{gifts.length}</span>
              <span className="text-xs text-gray-500">regalos</span>
            </div>
            {isEventPlan && (
              <div className="bg-white border border-gray-200 rounded-3xl p-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Invitados cargados</span>
                <span className="text-2xl font-bold text-gray-900 mt-2 block">{manualGuests.length}</span>
                <span className="text-xs text-gray-500">en tu lista de invitados</span>
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block">Tu enlace</span>
              <span className="text-sm font-semibold text-gray-900 truncate block">{siteUrl}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onOpenSite}
                className="uppercase px-3.5 min-h-11 bg-gray-900 hover:bg-black text-white text-xs font-normal rounded-2xl inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{isEventPlan ? 'Ver tu sitio' : 'Ver tu lista'}</span>
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="uppercase px-3.5 min-h-11 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-normal rounded-2xl inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Enlace copiado' : 'Copiar enlace'}</span>
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="uppercase px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-normal rounded-2xl inline-flex items-center gap-1.5 transition-colors"
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
              className={`bg-white border rounded-3xl p-4 sm:p-5 flex items-start gap-4 transition-colors ${
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
                className={`uppercase shrink-0 px-3.5 min-h-11 text-xs font-normal rounded-2xl transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                  isNext
                    ? 'bg-gray-900 hover:bg-black text-white'
                    : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {step.status === 'done' && !viewOrPublishStepIds.has(step.id) ? 'Editar' : step.cta}
              </button>
            </li>
          );
        })}
      </ol>

      {/* COMPLEMENTOS (opcionales) */}
      {extras.length > 0 && (
      <section className="space-y-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Complementos</h3>
          <p className="text-xs text-gray-500 mt-0.5">Opcionales: podés publicar sin completarlos.</p>
        </div>
        <ul className="space-y-2">
          {extras.map((x) => (
            <li key={x.id} className="bg-white border border-gray-200 rounded-3xl px-4 py-3 flex items-center gap-3">
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
                className="uppercase shrink-0 px-3 min-h-11 text-xs font-normal rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-600 cursor-pointer transition-colors"
              >
                {x.cta}
              </button>
            </li>
          ))}
        </ul>
      </section>
      )}

      {/* BARRA FIJA: SIGUIENTE PASO */}
      {nextStep && (
        <div className="sticky bottom-4 z-20">
          <div className="bg-gray-900 text-white rounded-3xl px-4 sm:px-5 py-3 flex items-center justify-between gap-4">
            <p className="text-xs sm:text-sm min-w-0 truncate">
              <span className="text-white/60">Siguiente paso: </span>
              <span className="font-semibold">{nextStep.title}</span>
            </p>
            <button
              type="button"
              onClick={nextStep.action}
              className="uppercase shrink-0 px-3.5 min-h-11 bg-white text-gray-900 hover:bg-gray-100 text-xs font-normal rounded-2xl cursor-pointer transition-colors"
            >
              {nextStep.cta} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
