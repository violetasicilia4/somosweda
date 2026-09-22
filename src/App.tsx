/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppView, WeddingData, Guest, GiftItem, WeddingEvent, ReceivedGift } from './types';
import { initialWedding, initialGuests, initialGifts, initialEvents, initialReceivedGifts } from './data/initialData';
import { LandingView } from './components/LandingView';
import { AuthViews } from './components/AuthViews';
import { CreateWeddingModal } from './components/CreateWeddingModal';
import { DashboardView } from './components/DashboardView';
import { MicrositeModal } from './components/MicrositeModal';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [isGuestStandalone, setIsGuestStandalone] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('guest') === '1' || window.location.hash === '#guest';
  });
  const [wedding, setWedding] = useState<WeddingData>(initialWedding);
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [gifts, setGifts] = useState<GiftItem[]>(initialGifts);
  const [receivedGifts, setReceivedGifts] = useState<ReceivedGift[]>(initialReceivedGifts);
  const [events, setEvents] = useState<WeddingEvent[]>(initialEvents);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  // "Ver mi web" siempre abre el micrositio real (misma vista que verán los invitados),
  // nunca una simulación o preview dentro del dashboard.
  const handleOpenMicrosite = () => {
    if (typeof window === 'undefined') return;
    try {
      window.open(`${window.location.origin}${window.location.pathname}?guest=1`, '_blank');
    } catch (err) {
      console.warn('Could not open microsite tab:', err);
    }
  };

  const handleUpdateWedding = (updated: Partial<WeddingData>) => {
    setWedding(prev => ({ ...prev, ...updated }));
  };

  const handleAddGuest = (newGuest: Omit<Guest, 'id'>) => {
    const guest: Guest = {
      ...newGuest,
      id: `g_${Date.now()}`,
    };
    setGuests(prev => [guest, ...prev]);
  };

  const handleUpdateGuestStatus = (guestId: string, status: Guest['status']) => {
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, status } : g));
  };

  const handleDeleteGuest = (guestId: string) => {
    setGuests(prev => prev.filter(g => g.id !== guestId));
  };

  const handleAddGift = (newGift: Omit<GiftItem, 'id' | 'currentAmount'>) => {
    const gift: GiftItem = {
      ...newGift,
      id: `gf_${Date.now()}`,
      currentAmount: 0,
    };
    setGifts(prev => [gift, ...prev]);
  };

  const handleAddGiftsFromSet = (newGifts: Omit<GiftItem, 'id'>[]) => {
    const created: GiftItem[] = newGifts.map((g, idx) => ({
      ...g,
      id: `gf_set_${Date.now()}_${idx}`,
      currentAmount: 0,
    }));
    setGifts(prev => [...prev, ...created]);
  };

  const handleDeleteGift = (giftId: string) => {
    setGifts(prev => prev.filter(g => g.id !== giftId));
  };

  const handleUpdateGift = (giftId: string, updates: Partial<GiftItem>) => {
    setGifts(prev => prev.map(g => g.id === giftId ? { ...g, ...updates } : g));
  };

  const handleReorderGifts = (newGifts: GiftItem[]) => {
    setGifts(newGifts);
  };

  const handleAddReceivedGift = (newReceived: Omit<ReceivedGift, 'id'>) => {
    const rec: ReceivedGift = {
      ...newReceived,
      id: `rg_${Date.now()}`,
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Main Views */}
      <div className="flex-1 flex flex-col">
        {currentView === 'landing' && (
          <LandingView
            onNavigate={(view) => setCurrentView(view)}
            onOpenExample={handleOpenMicrosite}
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
            guests={guests}
            gifts={gifts}
            receivedGifts={receivedGifts}
            events={events}
            onUpdateWedding={handleUpdateWedding}
            onAddGuest={handleAddGuest}
            onUpdateGuestStatus={handleUpdateGuestStatus}
            onDeleteGuest={handleDeleteGuest}
            onAddGift={handleAddGift}
            onAddGiftsFromSet={handleAddGiftsFromSet}
            onDeleteGift={handleDeleteGift}
            onUpdateGift={handleUpdateGift}
            onReorderGifts={handleReorderGifts}
            onUpdateReceivedGift={handleUpdateReceivedGift}
            onOpenMicrosite={handleOpenMicrosite}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}
      </div>
    </div>
  );
}
