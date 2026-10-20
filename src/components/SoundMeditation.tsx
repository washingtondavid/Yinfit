import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Wind, Waves, Play, Pause } from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';

export const SoundMeditation: React.FC = () => {
  const [isPlayingStream, setIsPlayingStream] = useState<boolean>(false);
  const [streamStopFn, setStreamStopFn] = useState<(() => void) | null>(null);
  const [breathActive, setBreathActive] = useState<boolean>(false);
  const [breathState, setBreathState] = useState<'Inhala' | 'Exhala'>('Inhala');

  const toggleStream = () => {
    if (isPlayingStream && streamStopFn) {
      streamStopFn();
      setIsPlayingStream(false);
      setStreamStopFn(null);
    } else {
      const stop = soundEngine.startWaterStream();
      setStreamStopFn(() => stop);
      setIsPlayingStream(true);
    }
  };

  useEffect(() => {
    return () => {
      if (streamStopFn) streamStopFn();
    };
  }, [streamStopFn]);

  // Guided breathing loop
  useEffect(() => {
    if (!breathActive) return;
    const interval = setInterval(() => {
      setBreathState((prev) => {
        const next = prev === 'Inhala' ? 'Exhala' : 'Inhala';
        soundEngine.playBreathChime(next === 'Inhala');
        return next;
      });
    }, 5500);

    return () => clearInterval(interval);
  }, [breathActive]);

  const toggleBreathing = () => {
    if (!breathActive) {
      soundEngine.playBreathChime(true);
    }
    setBreathActive(!breathActive);
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Header */}
      <div className="rounded-2xl bg-[#14181f] border border-[#252b36] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs text-[#8b94a3]">
            <span>Acústica Sagrada</span>
            <span aria-hidden="true">·</span>
            <span>Web Audio Sintetizado</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#c49b66]">Frecuencias de Resonancia Qi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#f3f4f6]">
            Sonidos Relajantes & Meditación Guiada
          </h2>
          <p className="text-xs sm:text-sm text-[#98a2b3] leading-relaxed">
            Generador de cuenco tibetano armónico (216 Hz, 432 Hz y 528 Hz), murmullo de arroyo de bambú y campana de templo para modular el sistema nervioso simpático y sincronizar la respiración.
          </p>
        </div>

        {/* Thumbnail of generated singing bowl */}
        <div className="w-28 h-28 rounded-xl overflow-hidden border border-[#2e3746] shrink-0 shadow-sm">
          <img
            src="/src/assets/images/sound_singing_bowl_1792528477527.jpg"
            alt="Cuenco tibetano tradicional"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Grid of Sound Generators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Tibetan Singing Bowl Resonance Station */}
        <div className="p-6 rounded-2xl bg-[#14181f] border border-[#252b36] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#f3f4f6]">
                Cuenco Tibetano & Resonancia
              </h3>
              <p className="text-xs text-[#8b94a3]">
                Vibración armónica sostenida de 6 segundos.
              </p>
            </div>
            <Sparkles className="w-5 h-5 text-[#c49b66]" />
          </div>

          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={() => soundEngine.playSingingBowl(216, 6)}
              className="p-3.5 rounded-xl bg-[#161a21] hover:bg-[#1f242e] border border-[#252b36] hover:border-[#c49b66] text-center transition-all group"
            >
              <div className="text-xs font-semibold text-[#f3f4f6] group-hover:text-[#c49b66]">
                216 Hz
              </div>
              <div className="text-[11px] text-[#8b94a3] mt-0.5">
                Calma Profunda
              </div>
            </button>

            <button
              onClick={() => soundEngine.playSingingBowl(432, 6)}
              className="p-3.5 rounded-xl bg-[#161a21] hover:bg-[#1f242e] border border-[#252b36] hover:border-[#c49b66] text-center transition-all group"
            >
              <div className="text-xs font-semibold text-[#f3f4f6] group-hover:text-[#c49b66]">
                432 Hz
              </div>
              <div className="text-[11px] text-[#8b94a3] mt-0.5">
                Equilibrio Yin
              </div>
            </button>

            <button
              onClick={() => soundEngine.playSingingBowl(528, 6)}
              className="p-3.5 rounded-xl bg-[#161a21] hover:bg-[#1f242e] border border-[#252b36] hover:border-[#c49b66] text-center transition-all group"
            >
              <div className="text-xs font-semibold text-[#f3f4f6] group-hover:text-[#c49b66]">
                528 Hz
              </div>
              <div className="text-[11px] text-[#8b94a3] mt-0.5">
                Vitalidad Qi
              </div>
            </button>
          </div>

          <div className="text-xs text-[#8b94a3] italic font-serif-tcm pt-2">
            "El sonido limpia los canales sutiles antes de que el cuerpo inicie el movimiento."
          </div>
        </div>

        {/* Ambient Bamboo Water Stream */}
        <div className="p-6 rounded-2xl bg-[#14181f] border border-[#252b36] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#f3f4f6]">
                Arroyo de Bambú & Agua Viva
              </h3>
              <p className="text-xs text-[#8b94a3]">
                Sonido orgánico continuo para calmar el ritmo cardíaco.
              </p>
            </div>
            <Waves className="w-5 h-5 text-[#22d3ee]" />
          </div>

          <p className="text-xs text-[#98a2b3] leading-relaxed">
            Sintetizador acústico que imita el flujo de agua a través de canaletas de bambú tradicionales en jardines Zen.
          </p>

          <div className="pt-2">
            <button
              onClick={toggleStream}
              className={`w-full py-3 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 border transition-all ${
                isPlayingStream
                  ? 'bg-[#0a2d36] border-[#22d3ee] text-[#22d3ee]'
                  : 'bg-[#161a21] border-[#252b36] hover:border-[#3a4250] text-[#e7eaef]'
              }`}
            >
              {isPlayingStream ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#22d3ee]" />}
              <span>{isPlayingStream ? 'Detener Arroyo' : 'Reproducir Arroyo Continuo'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Guided Coherence Pacer Card */}
      <div className="rounded-2xl bg-[#14181f] border border-[#252b36] p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-md">
          <div className="text-xs text-[#6f97ff] font-semibold flex items-center gap-1.5">
            <Wind className="w-4 h-4" />
            Guía de Coherencia 365 con Campana Acústica
          </div>
          <h3 className="text-lg font-display font-bold text-[#f3f4f6]">
            Pacer Respiratorio 5.5s Inhalación / 5.5s Exhalación
          </h3>
          <p className="text-xs text-[#98a2b3] leading-relaxed">
            Sigue la campana: la frecuencia alta indica inhalar por la nariz ensanchando el abdomen; la frecuencia profunda indica exhalar liberando los hombros y el diafragma.
          </p>
          <button
            onClick={toggleBreathing}
            className="px-5 py-2.5 rounded-lg bg-[#c49b66] hover:bg-[#b08753] text-[#0d1014] font-semibold text-xs transition-colors flex items-center gap-2"
          >
            {breathActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{breathActive ? 'Pausar Pacer' : 'Iniciar Guía de Respiración'}</span>
          </button>
        </div>

        {/* Breathing Orb */}
        <div className="w-48 h-48 rounded-full border border-[#252b36] bg-[#0d1014] flex items-center justify-center shrink-0">
          <div
            className={`w-36 h-36 rounded-full border border-[#c49b66] flex flex-col items-center justify-center transition-all duration-[5500ms] ease-in-out ${
              breathActive && breathState === 'Inhala'
                ? 'scale-110 bg-[#c49b66]/15 shadow-[0_0_35px_rgba(196,155,102,0.25)]'
                : 'scale-90 bg-transparent'
            }`}
          >
            <span className="text-xs uppercase tracking-wider text-[#8b94a3] font-mono-num font-semibold">
              {breathActive ? breathState : 'En Espera'}
            </span>
            <span className="text-sm font-serif-tcm text-[#f3f4f6] mt-0.5">
              5.5 s
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
