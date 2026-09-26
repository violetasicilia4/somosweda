import React, { useState } from 'react';
import {
  WeddingData,
  GiftItem,
  WeddingEvent,
  DashboardTab,
  AppView,
  ReceivedGift,
  CuentaSection,
  DurationMonths,
} from '../types';
import { durationOptions } from '../data/initialData';
import { addMonths, formatARS, formatLongDate } from '../utils/format';
import { DashboardSidebar } from './dashboard/DashboardSidebar';
import { HomeChecklistView } from './dashboard/HomeChecklistView';
import { GiftRegistryView } from './dashboard/GiftRegistryView';
import { ReceivedGiftsView } from './dashboard/ReceivedGiftsView';
import { MicrositeBuilderView } from './dashboard/MicrositeBuilderView';
import { AccountView } from './dashboard/AccountView';
import { HelpView } from './dashboard/HelpView';
import { CobrosView } from './dashboard/CobrosView';
import { DurationPicker } from './dashboard/DurationPicker';
import {
  ExternalLink,
  Check,
  CreditCard,
  Globe,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  wedding: WeddingData;
  gifts: GiftItem[];
  receivedGifts: ReceivedGift[];
  events: WeddingEvent[];
  onUpdateWedding: (updated: Partial<WeddingData>) => void;
  onAddGift: (gift: Omit<GiftItem, 'id' | 'currentAmount'>) => void;
  onDeleteGift: (giftId: string) => void;
  onUpdateGift?: (giftId: string, updates: Partial<GiftItem>) => void;
  onUpdateReceivedGift: (giftId: string, updates: Partial<ReceivedGift>) => void;
  onOpenMicrosite: () => void;
  onNavigate: (view: AppView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  wedding,
  gifts,
  receivedGifts = [],
  events,
  onUpdateWedding,
  onAddGift,
  onDeleteGift,
  onUpdateGift,
  onUpdateReceivedGift,
  onOpenMicrosite,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('inicio');
  const [cuentaSection, setCuentaSection] = useState<CuentaSection>('datos');
  // Paso 5 del checklist: se completa al abrir "Ver tu lista"
  const [siteViewed, setSiteViewed] = useState(false);

  // Publish modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPublishingInProgress, setIsPublishingInProgress] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<DurationMonths>(wedding.durationMonths ?? 12);
  // La cuenta de cobro se completa en el paso 3 del checklist; acá solo se puede revisar.
  const [isEditingCobro, setIsEditingCobro] = useState(false);
  const isPaymentConfigured = Boolean(
    wedding.bankAlias?.trim() || wedding.bankCbu?.trim() || wedding.mercadoPagoAlias?.trim()
  );

  // Mismos requisitos que el checklist: al menos 5 regalos y la cuenta de cobro cargada
  const giftsReady = gifts.length >= 5;
  const canPublish = isPaymentConfigured && giftsReady;

  const selectedOption = durationOptions.find((o) => o.months === selectedMonths) ?? durationOptions[1];
  const isPublished = wedding.status === 'PUBLICADO';

  // Regalos recibidos que todavía esperan un agradecimiento — badge de Regalos
  const pendingReceivedCount = receivedGifts.filter((r) => !r.isThanked).length;

  const goTo = (tab: DashboardTab, section?: CuentaSection) => {
    setActiveTab(tab);
    if (tab === 'cuenta' && section) setCuentaSection(section);
  };

  const openSite = () => {
    setSiteViewed(true);
    onOpenMicrosite();
  };

  const handleOpenPublishModal = () => {
    setSelectedMonths(wedding.durationMonths ?? 12);
    setIsEditingCobro(false);
    setIsPaymentModalOpen(true);
  };

  // Publicación de la lista (prototipo: el pago está simulado)
  const handleExecutePayment = () => {
    setIsPublishingInProgress(true);
    setTimeout(() => {
      onUpdateWedding({
        durationMonths: selectedMonths,
        status: 'PUBLICADO',
        setupProgress: 100,
        publishedAt: new Date().toISOString(),
      });
      setIsPublishingInProgress(false);
      setIsPaymentModalOpen(false);
      setActiveTab('inicio');
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <DashboardSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => goTo(tab)}
        wedding={wedding}
        pendingReceivedCount={pendingReceivedCount}
        onLogout={() => onNavigate('landing')}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* TOP CONTEXT BAR */}
        <header className="bg-white/90 backdrop-blur-xs border-b border-gray-200 px-6 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xs font-bold text-gray-900 truncate">{wedding.coupleName}</span>
            <span className="text-gray-300 hidden sm:inline">•</span>
            <span className="text-xs text-gray-500 hidden sm:inline">{formatLongDate(wedding.weddingDate)}</span>

            {/* Status badge */}
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${
                isPublished
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {isPublished ? 'Publicado' : 'Borrador'}
            </span>
            {!isPublished && (
              <span className="text-[11px] text-gray-500 hidden lg:inline">
                Tu lista no es pública hasta que la publiques.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={openSite}
              className="uppercase px-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-normal inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
              <span>Ver tu lista</span>
            </button>

            {!isPublished ? (
              <button
                type="button"
                onClick={handleOpenPublishModal}
                className="uppercase px-4 py-1.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-normal inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Publicar tu lista</span>
              </button>
            ) : (
              <div className="text-xs text-emerald-800 font-semibold px-2 py-1 bg-emerald-50 rounded-lg flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>En vivo</span>
              </div>
            )}
          </div>
        </header>

        {/* MAIN BODY VIEW */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto">
          {activeTab === 'inicio' && (
            <HomeChecklistView
              wedding={wedding}
              gifts={gifts}
              receivedGifts={receivedGifts}
              isPaymentConfigured={isPaymentConfigured}
              siteViewed={siteViewed}
              onGoTo={goTo}
              onOpenSite={openSite}
              onPublish={handleOpenPublishModal}
            />
          )}

          {activeTab === 'regalos' && (
            <GiftRegistryView
              wedding={wedding}
              gifts={gifts}
              onAddGift={onAddGift}
              onDeleteGift={onDeleteGift}
              onUpdateGift={onUpdateGift}
              onOpenMicrosite={openSite}
            />
          )}

          {activeTab === 'recibidos' && (
            <ReceivedGiftsView receivedGifts={receivedGifts} onUpdateReceivedGift={onUpdateReceivedGift} />
          )}

          {activeTab === 'sitio' && (
            <MicrositeBuilderView
              wedding={wedding}
              events={events}
              gifts={gifts}
              onUpdateWedding={onUpdateWedding}
              onOpenMicrosite={openSite}
            />
          )}

          {activeTab === 'ayuda' && <HelpView />}

          {activeTab === 'cuenta' && (
            <AccountView
              wedding={wedding}
              onUpdateWedding={onUpdateWedding}
              section={cuentaSection}
              onSectionChange={setCuentaSection}
              onPublish={handleOpenPublishModal}
            />
          )}
        </main>
      </div>

      {/* ================= MODAL: PUBLICAR TU LISTA ================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-gray-100 animate-fade-in space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-2 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                  Un solo pago
                </span>
                <h3 className="font-bold text-lg text-gray-900">Publicar tu lista</h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-xs font-semibold p-1 cursor-pointer"
              >
                Cerrar
              </button>
            </div>

            {/* Cuenta de cobro: se revisa acá, se completa en el paso 3 del checklist */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-gray-700">Dónde recibís el dinero</span>
              {isPaymentConfigured && !isEditingCobro ? (
                <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Cuenta de cobro cargada</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingCobro(true)}
                    className="text-xs font-semibold text-emerald-800 underline shrink-0 cursor-pointer"
                  >
                    Editar
                  </button>
                </div>
              ) : (
                <CobrosView wedding={wedding} onUpdateWedding={onUpdateWedding} compact />
              )}
            </div>

            <div className="space-y-3">
              <span className="block text-xs font-semibold text-gray-700">Elegí por cuánto tiempo</span>
              <DurationPicker value={selectedMonths} onChange={setSelectedMonths} />

              <div className="bg-gray-50 border border-gray-200/80 p-4 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                  <span>{selectedMonths} meses</span>
                  <span className="text-base">{formatARS(selectedOption.price)}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Activo hasta el {formatLongDate(addMonths(new Date(), selectedMonths))}. Un solo pago, sin renovaciones automáticas.
                </p>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tu lista de regalos en vivo en weda.app/boda/{wedding.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Regalos sin límite en tu lista</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sin comisión por regalo: el dinero va directo a tu cuenta</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={isPublishingInProgress || !canPublish}
                onClick={handleExecutePayment}
                className="uppercase w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-normal cursor-pointer flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishingInProgress ? (
                  <span>Publicando tu lista...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pagar {formatARS(selectedOption.price)} y publicar tu lista</span>
                  </>
                )}
              </button>
              {!canPublish && !isPublishingInProgress && (
                <p className="text-[11px] text-center text-amber-700">
                  {!isPaymentConfigured
                    ? 'Cargá tu cuenta de cobro para poder publicar.'
                    : `Sumá al menos 5 regalos a tu lista para poder publicar (tenés ${gifts.length}).`}
                </p>
              )}

              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="uppercase w-full py-2 text-xs font-normal text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                Seguir en borrador
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
