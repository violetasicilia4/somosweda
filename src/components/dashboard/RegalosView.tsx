import React from 'react';
import { GiftItem, ReceivedGift, RegalosSection, WeddingData } from '../../types';
import { GiftRegistryView } from './GiftRegistryView';
import { ReceivedGiftsView } from './ReceivedGiftsView';

interface RegalosViewProps {
  wedding: WeddingData;
  gifts: GiftItem[];
  receivedGifts: ReceivedGift[];
  section: RegalosSection;
  onSectionChange: (section: RegalosSection) => void;
  pendingReceivedCount: number;
  onAddGift: (gift: Omit<GiftItem, 'id' | 'currentAmount'>) => void;
  onDeleteGift: (giftId: string) => void;
  onUpdateGift?: (giftId: string, updates: Partial<GiftItem>) => void;
  onUpdateReceivedGift: (giftId: string, updates: Partial<ReceivedGift>) => void;
  onOpenSite: () => void;
}

const TABS: { id: RegalosSection; label: string }[] = [
  { id: 'lista', label: 'Mi lista' },
  { id: 'recibidos', label: 'Seguimiento' },
];

// Regalos: una sola pantalla con dos pestañas — la lista que arma la pareja y el seguimiento de lo que ya recibió.
export const RegalosView: React.FC<RegalosViewProps> = ({
  wedding,
  gifts,
  receivedGifts,
  section,
  onSectionChange,
  pendingReceivedCount,
  onAddGift,
  onDeleteGift,
  onUpdateGift,
  onUpdateReceivedGift,
  onOpenSite,
}) => (
  <div className="space-y-6">
    <div className="flex items-center gap-6 border-b border-gray-200">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onSectionChange(t.id)}
          className={`pb-3.5 text-xs font-normal uppercase transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            section === t.id ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span>{t.label}</span>
          {t.id === 'recibidos' && pendingReceivedCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
              {pendingReceivedCount}
            </span>
          )}
        </button>
      ))}
    </div>

    {section === 'lista' ? (
      <GiftRegistryView
        wedding={wedding}
        gifts={gifts}
        onAddGift={onAddGift}
        onDeleteGift={onDeleteGift}
        onUpdateGift={onUpdateGift}
        onOpenMicrosite={onOpenSite}
      />
    ) : (
      <ReceivedGiftsView receivedGifts={receivedGifts} onUpdateReceivedGift={onUpdateReceivedGift} />
    )}
  </div>
);
