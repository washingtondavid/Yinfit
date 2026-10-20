import React from 'react';
import { UserProfile } from '../types';
import { Shield, Moon, Sun, Bell, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeProfile: UserProfile;
  onOpenProfileModal: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onRequestNotification: () => void;
  notificationGranted: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  activeProfile,
  onOpenProfileModal,
  darkMode,
  onToggleDarkMode,
  isMuted,
  onToggleMute,
  onRequestNotification,
  notificationGranted,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0d1014]/90 dark:bg-[#0d1014]/90 backdrop-blur-md border-b border-[#252b36] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Zone 1: Single text element wordmark with oriental seal nuance */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c49b66] to-[#8c6734] flex items-center justify-center text-[#0d1014] font-bold text-base shadow-sm">
            气
          </div>
          <button 
            onClick={() => onTabChange('estudio')} 
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-lg font-display tracking-wide font-bold text-[#f3f4f6] group-hover:text-[#c49b66] transition-colors whitespace-nowrap">
              QiPosture
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-[#8b94a3] font-serif-tcm italic">
              津液 & Vitalidad
            </span>
          </button>
        </div>

        {/* Zone 2: 5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#98a2b3]">
          <button
            onClick={() => onTabChange('estudio')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              currentTab === 'estudio'
                ? 'text-[#f3f4f6] border-[#c49b66] font-semibold'
                : 'border-transparent hover:text-[#f3f4f6]'
            }`}
          >
            Rutina 22m
          </button>
          <button
            onClick={() => onTabChange('vision')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'vision'
                ? 'text-[#f3f4f6] border-[#c49b66] font-semibold'
                : 'border-transparent hover:text-[#f3f4f6]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c49b66]" />
            Alineación IA
          </button>
          <button
            onClick={() => onTabChange('progreso')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              currentTab === 'progreso'
                ? 'text-[#f3f4f6] border-[#c49b66] font-semibold'
                : 'border-transparent hover:text-[#f3f4f6]'
            }`}
          >
            Progreso Semanal
          </button>
          <button
            onClick={() => onTabChange('circadiano')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              currentTab === 'circadiano'
                ? 'text-[#f3f4f6] border-[#c49b66] font-semibold'
                : 'border-transparent hover:text-[#f3f4f6]'
            }`}
          >
            Reloj Circadiano
          </button>
          <button
            onClick={() => onTabChange('sonidos')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
              currentTab === 'sonidos'
                ? 'text-[#f3f4f6] border-[#c49b66] font-semibold'
                : 'border-transparent hover:text-[#f3f4f6]'
            }`}
          >
            Sonidos Zen
          </button>
        </nav>

        {/* Zone 3: Actions - Audio Mute, Notifications, Theme, and Profile Vault trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Quick Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
            className="w-9 h-9 rounded-lg border border-[#252b36] hover:border-[#3a4250] bg-[#161a21] text-[#98a2b3] hover:text-[#f3f4f6] flex items-center justify-center transition-colors"
            aria-label="Alternar sonido ambiental"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-[#8b94a3]" /> : <Volume2 className="w-4 h-4 text-[#c49b66]" />}
          </button>

          {/* Daily Push Notification Alert Trigger */}
          <button
            onClick={onRequestNotification}
            title={notificationGranted ? 'Notificaciones activas' : 'Activar recordatorios circadiano'}
            className={`w-9 h-9 rounded-lg border border-[#252b36] hover:border-[#3a4250] bg-[#161a21] flex items-center justify-center transition-colors ${
              notificationGranted ? 'text-[#34d399]' : 'text-[#98a2b3] hover:text-[#f3f4f6]'
            }`}
            aria-label="Recordatorios push diarios"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="Alternar tema"
            className="w-9 h-9 rounded-lg border border-[#252b36] hover:border-[#3a4250] bg-[#161a21] text-[#98a2b3] hover:text-[#f3f4f6] flex items-center justify-center transition-colors"
            aria-label="Cambiar tema de color"
          >
            {darkMode ? <Sun className="w-4 h-4 text-[#fbbf24]" /> : <Moon className="w-4 h-4 text-[#6f97ff]" />}
          </button>

          {/* Profile & Vault Action */}
          <button
            onClick={onOpenProfileModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a202a] hover:bg-[#222a38] border border-[#2e3746] text-xs font-medium text-[#e7eaef] transition-colors whitespace-nowrap"
          >
            <Shield className="w-3.5 h-3.5 text-[#c49b66]" />
            <span className="hidden sm:inline-block max-w-[110px] truncate">{activeProfile.name}</span>
            <span className="text-[11px] text-[#34d399] font-mono-num">AES-256</span>
          </button>
        </div>

      </div>

      {/* Mobile Sub-Navigation Bar for Small Touch Viewports */}
      <div className="lg:hidden flex items-center justify-around px-2 py-2 border-t border-[#1e242e] bg-[#11141a] text-xs">
        <button
          onClick={() => onTabChange('estudio')}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
            currentTab === 'estudio' ? 'text-[#c49b66] font-semibold' : 'text-[#8b94a3]'
          }`}
        >
          Rutina 22m
        </button>
        <button
          onClick={() => onTabChange('vision')}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
            currentTab === 'vision' ? 'text-[#c49b66] font-semibold' : 'text-[#8b94a3]'
          }`}
        >
          Visión IA
        </button>
        <button
          onClick={() => onTabChange('progreso')}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
            currentTab === 'progreso' ? 'text-[#c49b66] font-semibold' : 'text-[#8b94a3]'
          }`}
        >
          Progreso
        </button>
        <button
          onClick={() => onTabChange('circadiano')}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
            currentTab === 'circadiano' ? 'text-[#c49b66] font-semibold' : 'text-[#8b94a3]'
          }`}
        >
          Circadiano
        </button>
        <button
          onClick={() => onTabChange('sonidos')}
          className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
            currentTab === 'sonidos' ? 'text-[#c49b66] font-semibold' : 'text-[#8b94a3]'
          }`}
        >
          Sonidos
        </button>
      </div>
    </header>
  );
};
