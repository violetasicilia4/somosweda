/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AppView, WeddingData, ManualGuest, ManualGuestStatus, GiftItem, WeddingEvent, ReceivedGift, WeddingPlan } from './types';
import { initialWedding, initialManualGuests, initialGifts, initialEvents, initialReceivedGifts } from './data/initialData';
import { withPlanChange } from './utils/plan';
import { persistWedding, persistWeddingEvents } from './utils/weddingStore';
import { LandingView } from './components/LandingView';
import { AuthViews } from './components/AuthViews';
import { ChoosePlanView } from './components/ChoosePlanView';
import { CreateWeddingModal } from './components/CreateWeddingModal';
import { DashboardView } from './components/DashboardView';
import { MicrositeModal } from './components/MicrositeModal';
import { ExampleView } from './components/ExampleView';
import { FindCoupleView } from './components/FindCoupleView';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isGuestStandalone, setIsGuestStandalone] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('guest') === '1' || window.location.hash === '#guest';
  });
  const [isExample] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('example') === '1';
  });
  const [wedding, setWedding] = useState<WeddingData>(initialWedding);
  const [manualGuests, setManualGuests] = useState<ManualGuest[]>(initialManualGuests);
  const [gifts, setGifts] = useState<GiftItem[]>(initialGifts);
  const [receivedGifts, setReceivedGifts] = useState<ReceivedGift[]>(initialReceivedGifts);
  const [events, setEvents] = useState<WeddingEvent[]>(initialEvents);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // Puente para "Ver tu lista": esa vista se abre en una pestaña nueva y completamente
  // aparte (ver weddingStore.ts), así que cada cambio acá se refleja en localStorage
  // para que el sitio de ejemplo pueda leer los datos reales en vez de mostrar defaults.
  // Ojo: la propia pestaña de ejemplo también monta este componente (isExample=true) con
  // wedding/events en sus valores default — si no la excluimos acá, pisaría con esos
  // defaults lo que acababa de guardar la pestaña del dashboard.
  useEffect(() => {
    if (isExample) return;
    persistWedding(wedding);
  }, [isExample, wedding]);

  useEffect(() => {
    if (isExample) return;
    persistWeddingEvents(events);
  }, [isExample, events]);

  // "Ver tu lista" abre la página de ejemplo (la vista que ven los invitados),
  // nunca una simulación o preview dentro del dashboard.
  const handleOpenExample = (screen?: 'home' | 'gifts' | 'rsvp') => {
    if (typeof window === 'undefined') return;
    try {
      const suffix = screen && screen !== 'home' ? `&screen=${screen}` : '';
      window.open(`${window.location.origin}${window.location.pathname}?example=1${suffix}`, '_blank');
    } catch (err) {
      console.warn('Could not open example tab:', err);
    }
  };

  const handleOpenMicrosite = () => {
    if (typeof window === 'undefined') return;
    try {
      window.open(`${window.location.origin}${window.location.pathname}?example=1`, '_blank');
    } catch (err) {
      console.warn('Could not open microsite tab:', err);
    }
  };

  const handleUpdateWedding = (updated: Partial<WeddingData>) => {
    setWedding(prev => ({ ...prev, ...updated }));
  };

  // Cambiar de plan (onboarding, "Explorar planes", pantallas de "Probar X") nunca borra
  // nada: withPlanChange se encarga de que highestPlan nunca baje, aunque el usuario
  // vuelva a un plan más chico.
  const handleSelectPlan = (plan: WeddingPlan) => {
    setWedding(prev => ({ ...prev, ...withPlanChange(prev, plan) }));
  };

  const handleAddManualGuest = (newGuest: Omit<ManualGuest, 'id'>) => {
    const guest: ManualGuest = {
      ...newGuest,
      id: `mg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    };
    setManualGuests(prev => [guest, ...prev]);
  };

  const handleUpdateManualGuestStatus = (guestId: string, status: ManualGuestStatus) => {
    setManualGuests(prev => prev.map(g => g.id === guestId ? { ...g, status } : g));
  };

  const handleDeleteManualGuest = (guestId: string) => {
    setManualGuests(prev => prev.filter(g => g.id !== guestId));
  };

  // Importación CSV: mismos 3 campos que la carga manual, sin matching contra nada.
  const handleImportManualGuests = (newGuests: Omit<ManualGuest, 'id'>[]) => {
    const withIds: ManualGuest[] = newGuests.map((g, i) => ({
      ...g,
      id: `mg_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 8)}`,
    }));
    setManualGuests(prev => [...withIds, ...prev]);
  };

  const handleAddGift = (newGift: Omit<GiftItem, 'id' | 'currentAmount'>) => {
    // setGifts lee siempre el `prev` más reciente, incluso cuando esta función se
    // llama muchas veces seguidas en el mismo tick (p.ej. "Agregar todos" de una
    // categoría) — evita duplicados por título y colisiones de id basadas en Date.now().
    setGifts(prev => {
      const alreadyExists = prev.some(
        g => g.title.toLowerCase().trim() === newGift.title.toLowerCase().trim()
      );
      if (alreadyExists) return prev;
      const gift: GiftItem = {
        ...newGift,
        id: `gf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        currentAmount: 0,
      };
      return [gift, ...prev];
    });
  };

  const handleDeleteGift = (giftId: string) => {
    setGifts(prev => prev.filter(g => g.id !== giftId));
  };

  const handleUpdateGift = (giftId: string, updates: Partial<GiftItem>) => {
    setGifts(prev => prev.map(g => g.id === giftId ? { ...g, ...updates } : g));
  };

  const handleAddReceivedGift = (newReceived: Omit<ReceivedGift, 'id'>) => {
    const rec: ReceivedGift = {
      ...newReceived,
      id: `rg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    };
    setReceivedGifts(prev => [rec, ...prev]);
  };

  const handleUpdateReceivedGift = (giftId: string, updates: Partial<ReceivedGift>) => {
    setReceivedGifts(prev => prev.map(g => g.id === giftId ? { ...g, ...updates } : g));
  };

  const handleGiftContribute = (giftId: string, amount: number) => {
    setGifts(prev => prev.map(g => {
      if (g.id === giftId) {
        return {
          ...g,
          currentAmount: (g.currentAmount || 0) + amount
        };
      }
      return g;
    }));
  };

  if (isExample) {
    return <ExampleView wedding={wedding} events={events} />;
  }

  if (isGuestStandalone) {
    return (
      <MicrositeModal
        isOpen={true}
        isStandalone={true}
        onClose={() => {
          setIsGuestStandalone(false);
          if (typeof window !== 'undefined' && window.history) {
            window.history.pushState({}, '', window.location.pathname);
          }
        }}
        wedding={wedding}
        events={events}
        gifts={gifts}
        onGiftContribute={handleGiftContribute}
        onAddReceivedGift={handleAddReceivedGift}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col font-sans">
      {/* Main Views */}
      <div className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingView
            onNavigate={(view) => setCurrentView(view)}
            onOpenExample={handleOpenExample}
          />
        )}

        {currentView === 'find-couple' && (
          <FindCoupleView
            onNavigate={(view) => setCurrentView(view)}
            onOpenExample={handleOpenExample}
          />
        )}

        {(currentView === 'login' ||
          currentView === 'register' ||
          currentView === 'forgot-password' ||
          currentView === 'verify-pin' ||
          currentView === 'reset-password') && (
          <AuthViews
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            onAuthSuccess={(user) => setCurrentUser(user)}
          />
        )}

        {currentView === 'choose-plan' && (
          <ChoosePlanView
            onNavigate={(view) => setCurrentView(view)}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {currentView === 'create-wedding' && (
          <CreateWeddingModal
            wedding={wedding}
            onUpdateWedding={handleUpdateWedding}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            wedding={wedding}
            gifts={gifts}
            receivedGifts={receivedGifts}
            events={events}
            manualGuests={manualGuests}
            onUpdateWedding={handleUpdateWedding}
            onAddGift={handleAddGift}
            onDeleteGift={handleDeleteGift}
            onUpdateGift={handleUpdateGift}
            onUpdateReceivedGift={handleUpdateReceivedGift}
            onAddManualGuest={handleAddManualGuest}
            onUpdateManualGuestStatus={handleUpdateManualGuestStatus}
            onDeleteManualGuest={handleDeleteManualGuest}
            onImportManualGuests={handleImportManualGuests}
            onOpenMicrosite={handleOpenMicrosite}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}
      </div>
    </div>
  );
}
