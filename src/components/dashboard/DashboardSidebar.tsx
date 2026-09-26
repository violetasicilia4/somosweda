import React from 'react';
import { DashboardTab, WeddingData } from '../../types';
import {
  Gift,
  Layout,
  Heart,
  X,
  User,
  HelpCircle,
  Home,
  LogOut
} from 'lucide-react';
import { formatLongDate } from '../../utils/format';
import { Wordmark } from '../Wordmark';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  wedding: WeddingData;
  pendingReceivedCount: number;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}

type MenuItem = { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> };

// Todas las secciones tienen la misma jerarquía: mismo tamaño, tipografía y alineación.
// Invitados queda fuera de esta primera versión.
const MENU_ITEMS: MenuItem[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'regalos', label: 'Regalos', icon: Gift },
  { id: 'recibidos', label: 'Regalos recibidos', icon: Heart },
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
  open,
  onClose,
}) => {
  const renderItem = (item: MenuItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    const showBadge = item.id === 'recibidos' && pendingReceivedCount > 0;
    return (
      <button
        key={item.id}
        onClick={() => onSelectTab(item.id)}
        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-normal uppercase transition-all text-left cursor-pointer ${
          isActive
            ? 'bg-gray-900 text-white shadow-2xs'
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
    <aside
      className={`w-64 max-w-[85vw] bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 h-screen fixed lg:sticky inset-y-0 left-0 top-0 z-50 lg:z-auto transition-transform duration-200 ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* BRAND & WEDDING SUMMARY */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between gap-2 mb-6">
          <Wordmark />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="lg:hidden p-1.5 -mr-1.5 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
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
        {MENU_ITEMS.map(renderItem)}
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
