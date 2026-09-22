import React from 'react';
import { DashboardTab, WeddingData } from '../../types';
import {
  Gift,
  Layout,
  Users,
  User,
  HelpCircle,
  HandHeart,
  ExternalLink,
  Sparkles,
  LogOut
} from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  wedding: WeddingData;
  pendingReceivedCount: number;
  onOpenMicrosite: () => void;
  onLogout: () => void;
}

type MenuItem = { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> };

// Ordenado por relevancia emocional: primero los datos de la boda, después
// lo que la pareja arma y disfruta, y por último lo genuinamente administrativo
// (separado solo por un divisor visual, no por una etiqueta).
const PRIMARY_ITEMS: MenuItem[] = [
  { id: 'cuenta', label: 'Mi Boda', icon: User },
  { id: 'regalos', label: 'Lista de Regalos', icon: Gift },
  { id: 'recibidos', label: 'Regalos recibidos', icon: HandHeart },
  { id: 'micrositio', label: 'Micrositio', icon: Layout },
  { id: 'invitados', label: 'Invitados & RSVP', icon: Users },
];

const SECONDARY_ITEMS: MenuItem[] = [
  { id: 'plan', label: 'Plan y Facturación', icon: Sparkles },
  { id: 'ayuda', label: 'Ayuda', icon: HelpCircle },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onSelectTab,
  wedding,
  pendingReceivedCount,
  onOpenMicrosite,
  onLogout,
}) => {
  const renderItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const showBadge = item.id === 'recibidos' && pendingReceivedCount > 0;
    return (
      <button
        key={item.id}
        onClick={() => onSelectTab(item.id)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
          isActive
            ? 'bg-gray-900 text-white font-semibold shadow-2xs'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
        }`}
      >
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
        <span className="flex-1 truncate">{item.label}</span>
        {showBadge && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
            isActive ? 'bg-white/20 text-white' : 'bg-rose-500 text-white'
          }`}>
            {pendingReceivedCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* BRAND & WEDDING SUMMARY */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2 mb-6">
          <span className="font-serif text-2xl font-medium tracking-tight text-gray-900 cursor-pointer">
            Weda
          </span>
        </div>

        {/* Wedding Identity Card */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 truncate">
              {wedding.coupleName}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Borrador activo" />
          </div>
          <p className="text-[11px] text-gray-500 truncate">
            {wedding.weddingDate}
          </p>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {PRIMARY_ITEMS.map(renderItem)}

        <div className="pt-3 mt-2 border-t border-gray-100 space-y-1">
          {SECONDARY_ITEMS.map(renderItem)}
        </div>
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={onOpenMicrosite}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Ver micrositio</span>
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </button>
      </div>
    </aside>
  );
};
