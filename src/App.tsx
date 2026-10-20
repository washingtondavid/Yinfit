/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RoutinePlayer } from './components/RoutinePlayer';
import { AIPostureCoach } from './components/AIPostureCoach';
import { WeeklyTracker } from './components/WeeklyTracker';
import { CircadianWidget } from './components/CircadianWidget';
import { SoundMeditation } from './components/SoundMeditation';
import { WearableBiosensor } from './components/WearableBiosensor';
import { ProfilesManager } from './components/ProfilesManager';
import { INITIAL_PROFILES } from './data/exercisesData';
import { UserProfile, WeeklyLogDay, PostureAnalysisData } from './types';
import { soundEngine } from './utils/audioSynthesizer';
import { Sparkles, Bell, CheckCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('estudio');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [notificationGranted, setNotificationGranted] = useState<boolean>(false);
  const [inAppToast, setInAppToast] = useState<string | null>(null);

  // Profiles State
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem('qiposture_profiles');
      return stored ? JSON.parse(stored) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return profiles[0]?.id || 'prof-elena';
  });

  // Weekly logs state
  const [weeklyLogs, setWeeklyLogs] = useState<WeeklyLogDay[]>([
    {
      date: '2026-10-14',
      dayName: 'Lun',
      completed: true,
      score: 82,
      durationMinutes: 22,
      hrvMs: 64,
      avgBpm: 65,
      deviationsFixed: ['Cabeza adelantada 5°', 'Apertura torácica'],
      phasesDone: ['agua', 'respiracion', 'movilidad', 'drenaje', 'luz'],
    },
    {
      date: '2026-10-15',
      dayName: 'Mar',
      completed: true,
      score: 85,
      durationMinutes: 22,
      hrvMs: 70,
      avgBpm: 63,
      deviationsFixed: ['Descenso de escápulas', 'Sentadilla profunda'],
      phasesDone: ['agua', 'respiracion', 'movilidad', 'drenaje', 'luz'],
    },
    {
      date: '2026-10-16',
      dayName: 'Mié',
      completed: false,
      score: 72,
      durationMinutes: 8,
      hrvMs: 58,
      avgBpm: 68,
      deviationsFixed: ['Respiración diafragmática'],
      phasesDone: ['agua', 'respiracion'],
    },
    {
      date: '2026-10-17',
      dayName: 'Jue',
      completed: true,
      score: 88,
      durationMinutes: 22,
      hrvMs: 74,
      avgBpm: 62,
      deviationsFixed: ['Descompresión C1-C7', 'Pelvis neutra en 90/90'],
      phasesDone: ['agua', 'respiracion', 'movilidad', 'drenaje', 'luz'],
    },
    {
      date: '2026-10-18',
      dayName: 'Vie',
      completed: true,
      score: 91,
      durationMinutes: 22,
      hrvMs: 78,
      avgBpm: 61,
      deviationsFixed: ['Drenaje centrípeto completo', 'Simetría de hombros'],
      phasesDone: ['agua', 'respiracion', 'movilidad', 'drenaje', 'luz'],
    },
    {
      date: '2026-10-19',
      dayName: 'Sáb',
      completed: true,
      score: 90,
      durationMinutes: 22,
      hrvMs: 76,
      avgBpm: 60,
      deviationsFixed: ['Gato-camello segmentario', 'Anclaje circadiano'],
      phasesDone: ['agua', 'respiracion', 'movilidad', 'drenaje', 'luz'],
    },
    {
      date: '2026-10-20',
      dayName: 'Dom',
      completed: true,
      score: 93,
      durationMinutes: 22,
      hrvMs: 82,
      avgBpm: 59,
      deviationsFixed: ['Alineación Wu Ji perfecta', 'Tono vagal pico'],
      phasesDone: ['agua', 'respiracion', 'movilidad', 'drenaje', 'luz'],
    },
  ]);

  const [latestAnalysis, setLatestAnalysis] = useState<PostureAnalysisData | null>(null);

  // Active Profile
  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  // Save profiles
  useEffect(() => {
    localStorage.setItem('qiposture_profiles', JSON.stringify(profiles));
  }, [profiles]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Request notifications
  const handleRequestNotifications = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setNotificationGranted(true);
          setInAppToast('Notificaciones push activadas: recibirás recordatorios en tus momentos de pausa circadiana.');
          new Notification('QiPosture · Notificaciones Inteligentes', {
            body: 'Recordatorios circadianos configurados para las ventanas clave de órganos y práctica matutina.',
            icon: '/favicon.ico',
          });
        } else {
          setInAppToast('Notificaciones no permitidas por el navegador.');
        }
      });
    } else {
      setInAppToast('Recordatorios circadianos activados en la aplicación.');
      setNotificationGranted(true);
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const handleToggleDayLog = (date: string) => {
    setWeeklyLogs((prev) =>
      prev.map((log) =>
        log.date === date
          ? {
              ...log,
              completed: !log.completed,
              score: !log.completed ? Math.max(log.score, 85) : 60,
            }
          : log
      )
    );
  };

  const handleRoutineCompleted = (durationMinutes: number) => {
    soundEngine.playSingingBowl(432, 6);
    setInAppToast(`¡Felicidades! Completaste la rutina canónica de ${durationMinutes} minutos. Tu variabilidad y fluidos Jin Ye han sido activados.`);
    const today = new Date().toISOString().split('T')[0];
    setWeeklyLogs((prev) =>
      prev.map((log) =>
        log.date === today ? { ...log, completed: true, score: 94 } : log
      )
    );
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${darkMode ? 'bg-[#0d1014] text-[#e7eaef]' : 'bg-[#f6f7f9] text-[#11151a]'}`}>
      
      {/* Toast Notification Alert */}
      {inAppToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#161a21] border border-[#34d399] text-xs text-[#d8f3dc] shadow-xl flex items-center justify-between gap-3 max-w-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#34d399] shrink-0" />
            <span>{inAppToast}</span>
          </div>
          <button
            onClick={() => setInAppToast(null)}
            className="text-[#98a2b3] hover:text-[#f3f4f6] text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        activeProfile={activeProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onRequestNotification={handleRequestNotifications}
        notificationGranted={notificationGranted}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Tab 1: Estudio Canónico 22m */}
        {currentTab === 'estudio' && (
          <div className="space-y-6">
            <RoutinePlayer
              onRoutineCompleted={handleRoutineCompleted}
              onOpenVisionWithExercise={(exName) => {
                setCurrentTab('vision');
              }}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <CircadianWidget
                  onSchedulePauseAlert={(h, label) => {
                    setInAppToast(`Alerta programada: ${label} a las ${h}:00h.`);
                  }}
                />
              </div>
              <div className="lg:col-span-5">
                <WearableBiosensor />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Visión IA Postural */}
        {currentTab === 'vision' && (
          <div className="space-y-6">
            <AIPostureCoach
              activeProfile={activeProfile}
              onAnalysisComplete={(analysis) => {
                setLatestAnalysis(analysis);
                setInAppToast(`Alineación evaluada: ${analysis.overallScore}/100 (${analysis.postureGrade}).`);
              }}
            />
          </div>
        )}

        {/* Tab 3: Progreso Semanal & Reportes */}
        {currentTab === 'progreso' && (
          <div className="space-y-6">
            <WeeklyTracker
              weeklyLogs={weeklyLogs}
              onToggleDay={handleToggleDayLog}
              activeProfile={activeProfile}
              latestAnalysis={latestAnalysis}
            />
            <WearableBiosensor />
          </div>
        )}

        {/* Tab 4: Reloj Circadiano de Órganos MTC */}
        {currentTab === 'circadiano' && (
          <div className="space-y-6">
            <CircadianWidget
              onSchedulePauseAlert={(h, label) => {
                setInAppToast(`Alerta programada para las ${h}:00h: ${label}`);
              }}
            />
            <WearableBiosensor />
          </div>
        )}

        {/* Tab 5: Sonidos Zen & Meditación */}
        {currentTab === 'sonidos' && (
          <div className="space-y-6">
            <SoundMeditation />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#1e242e] py-6 px-4 text-center text-xs text-[#8b94a3] space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="font-display font-semibold text-[#f3f4f6]">QiPosture</span>
          <span aria-hidden="true">·</span>
          <span>Medicina Tradicional China & Fisiología Biomecánica</span>
          <span aria-hidden="true">·</span>
          <span>Bóveda Segura AES-256</span>
        </div>
        <p className="text-[#6b7484]">
          Basado en la secuencia fisiológica matutina: Hidratar, Respirar, Mover, Drenar e Iluminar.
        </p>
      </footer>

      {/* Multi-Profile & Vault Modal */}
      <ProfilesManager
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={(id) => {
          setActiveProfileId(id);
          setIsProfileModalOpen(false);
          setInAppToast(`Perfil activo cambiado a: ${profiles.find((p) => p.id === id)?.name}`);
        }}
        onAddProfile={(newP) => {
          setProfiles((prev) => [...prev, newP]);
          setActiveProfileId(newP.id);
        }}
        onImportVaultData={(importedProfiles) => {
          setProfiles(importedProfiles);
          if (importedProfiles[0]) setActiveProfileId(importedProfiles[0].id);
        }}
      />

    </div>
  );
}
