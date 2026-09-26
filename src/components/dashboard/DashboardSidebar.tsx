import React from 'react';
import { DashboardTab, WeddingData } from '../../types';
import {
  Gift,
  Layout,
  Users,
  User,
  HelpCircle,
  Home,
  LogOut
} from 'lucide-react';
import { formatLongDate } from '../../utils/format';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  wedding: WeddingData;
  pendingReceivedCount: number;
  onLogout: () => void;
}

type MenuItem = { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> };

// Jerarquía: Regalos es el producto (destacado). Invitados es soporte. Tu sitio, Ayuda y
// Cuenta van separados y atenuados.
const PRIMARY_ITEMS: MenuItem[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'regalos', label: 'Regalos', icon: Gift },
  { id: 'invitados', label: 'Invitados', icon: Users },
];

const SECONDARY_ITEMS: MenuItem[] = [
  { id: 'sitio', label: 'Tu sitio', icon: Layout },
  { id: 'ayuda', label: 'Ayuda', icon: HelpCircle },
  { id: 'cuenta', label: 'Cuenta', icon: User },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onSelectTab,
  wedding,
  pendingReceivedCount,
  onLogout,
}) => {
  const renderItem = (item: MenuItem, muted = false) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const isHero = item.id === 'regalos';
    const showBadge = item.id === 'regalos' && pendingReceivedCount > 0;
    const size = isHero ? 'py-3.5 text-sm font-semibold' : muted ? 'py-2 text-[11px] font-normal' : 'py-2.5 text-xs font-normal';
    const tone = isActive
      ? 'bg-gray-900 text-white shadow-2xs'
      : isHero
        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200/70'
        : muted
          ? 'text-gray-400 hover:text-gray-700 hover:bg-gray-100/80'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80';
    return (
      <button
        key={item.id}
        onClick={() => onSelectTab(item.id)}
        className={`w-full flex items-center gap-3 px-3.5 rounded-xl uppercase transition-all text-left cursor-pointer ${size} ${tone}`}
      >
        <Icon className={`${isHero ? 'w-5 h-5' : 'w-4 h-4'} shrink-0 ${isActive ? 'text-white' : isHero ? 'text-gray-900' : 'text-gray-400'}`} />
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
          <span className="text-[28px] font-normal uppercase leading-normal text-gray-900 cursor-pointer">
            Weda
          </span>
        </div>

        {/* Wedding Identity Card */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-900 truncate">
              {wedding.coupleName}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title={wedding.status === 'PUBLICADO' ? 'Publicado' : 'Borrador'} />
          </div>
          <p className="text-[11px] text-gray-500 truncate">
            {formatLongDate(wedding.weddingDate)}
          </p>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {PRIMARY_ITEMS.map((i) => renderItem(i))}

        <div className="pt-3 mt-2 border-t border-gray-100 space-y-1">
          {SECONDARY_ITEMS.map((i) => renderItem(i, true))}
        </div>
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="uppercase w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-normal text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  );
};
