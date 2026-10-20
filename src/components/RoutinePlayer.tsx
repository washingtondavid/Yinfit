import React, { useState, useEffect } from 'react';
import { EXERCISE_DATABASE } from '../data/exercisesData';
import { ExerciseItem, RoutinePhase } from '../types';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Check, Droplets, Wind, Sparkles, Sun, ShieldAlert, Volume2 } from 'lucide-react';
import { soundEngine } from '../utils/audioSynthesizer';

interface RoutinePlayerProps {
  onRoutineCompleted?: (durationMinutes: number) => void;
  onOpenVisionWithExercise?: (exerciseName: string) => void;
}

export const RoutinePlayer: React.FC<RoutinePlayerProps> = ({
  onRoutineCompleted,
  onOpenVisionWithExercise,
}) => {
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(EXERCISE_DATABASE[0].durationSeconds);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  // Breath pacer state for Phase 2
  const [breathPhase, setBreathPhase] = useState<'Inhala' | 'Exhala'>('Inhala');
  const [breathSeconds, setBreathSeconds] = useState<number>(5.5);

  const currentExercise = EXERCISE_DATABASE[activeExerciseIndex];

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && secondsRemaining === 0) {
      handleExerciseDone();
    }
    return () => clearInterval(interval);
  }, [isPlaying, secondsRemaining]);

  // Breath pacing loop for Phase 2 (Coherencia 365: 5.5s in, 5.5s out)
  useEffect(() => {
    if (currentExercise.phase !== 'respiracion' || !isPlaying) return;

    const breathInterval = setInterval(() => {
      setBreathPhase((prev) => {
        const next = prev === 'Inhala' ? 'Exhala' : 'Inhala';
        soundEngine.playBreathChime(next === 'Inhala');
        return next;
      });
    }, 5500);

    return () => clearInterval(breathInterval);
  }, [currentExercise.phase, isPlaying]);

  const handleExerciseDone = () => {
    soundEngine.playSingingBowl(324, 4);
    if (!completedExercises.includes(currentExercise.id)) {
      setCompletedExercises((prev) => [...prev, currentExercise.id]);
    }

    if (activeExerciseIndex < EXERCISE_DATABASE.length - 1) {
      goToExercise(activeExerciseIndex + 1);
    } else {
      setIsPlaying(false);
      if (onRoutineCompleted) {
        onRoutineCompleted(22);
      }
    }
  };

  const goToExercise = (index: number) => {
    setActiveExerciseIndex(index);
    setSecondsRemaining(EXERCISE_DATABASE[index].durationSeconds);
  };

  const togglePlay = () => {
    if (!isPlaying) {
      soundEngine.playSingingBowl(216, 3);
    }
    setIsPlaying(!isPlaying);
  };

  const resetTimer = () => {
    setIsPlaying(false);
    setSecondsRemaining(currentExercise.durationSeconds);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Phase badge icons
  const getPhaseIcon = (phase: RoutinePhase) => {
    switch (phase) {
      case 'agua':
        return <Droplets className="w-3.5 h-3.5 text-[#22d3ee]" />;
      case 'respiracion':
        return <Wind className="w-3.5 h-3.5 text-[#6f97ff]" />;
      case 'movilidad':
        return <Sparkles className="w-3.5 h-3.5 text-[#c49b66]" />;
      case 'drenaje':
        return <Droplets className="w-3.5 h-3.5 text-[#34d399]" />;
      case 'luz':
        return <Sun className="w-3.5 h-3.5 text-[#fbbf24]" />;
    }
  };

  return (
    <div className="space-y-6">

      {/* Hero Study Header with Generated Visual Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-[#252b36] bg-[#14181f]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/hero_bamboo_posture_1792528475713.jpg"
            alt="Bambú tradicional de medicina china"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d1014] via-[#0d1014]/90 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#8b94a3] mb-2">
            <span>Fisiología Matutina</span>
            <span aria-hidden="true">·</span>
            <span>22 Minutos Canónicos</span>
            <span aria-hidden="true">·</span>
            <span>Sin Material</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#c49b66]">Lógica Biomecánica y Jin Ye</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#f3f4f6]">
            Rutina Matutina de Bienestar & Postura
          </h1>
          <p className="text-sm text-[#98a2b3] mt-2 max-w-2xl leading-relaxed">
            Secuencia inmutable de 5 fases: <strong className="text-[#e7eaef]">Hidratar</strong> (volumen plasmático), <strong className="text-[#e7eaef]">Respirar</strong> (coherencia 365), <strong className="text-[#e7eaef]">Mover</strong> (dragón espinal), <strong className="text-[#e7eaef]">Drenar</strong> (retorno centrípeto) e <strong className="text-[#e7eaef]">Iluminar</strong> (anclaje circadiano).
          </p>
        </div>
      </div>

      {/* 5-Phases Progress Stepper Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {[
          { key: 'agua', name: '1. Agua & Sal', dur: '2 min' },
          { key: 'respiracion', name: '2. Respiración', dur: '5 min' },
          { key: 'movilidad', name: '3. Movilidad', dur: '7 min' },
          { key: 'drenaje', name: '4. Drenaje', dur: '5 min' },
          { key: 'luz', name: '5. Luz Circadiana', dur: '3 min' },
        ].map((phase, idx) => {
          const isCurrent = currentExercise.phase === phase.key;
          const isDone = completedExercises.some((id) => {
            const ex = EXERCISE_DATABASE.find((e) => e.id === id);
            return ex?.phase === phase.key;
          });

          return (
            <button
              key={phase.key}
              onClick={() => {
                const targetIdx = EXERCISE_DATABASE.findIndex((e) => e.phase === phase.key);
                if (targetIdx !== -1) goToExercise(targetIdx);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                isCurrent
                  ? 'bg-[#1c222c] border-[#c49b66] shadow-sm'
                  : 'bg-[#14181f] border-[#252b36] hover:border-[#3a4250]'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-[#8b94a3] mb-1">
                <span>Fase {idx + 1}</span>
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-[#34d399]" />
                ) : (
                  <span className="font-mono-num">{phase.dur}</span>
                )}
              </div>
              <div className={`text-xs font-semibold truncate ${isCurrent ? 'text-[#c49b66]' : 'text-[#e7eaef]'}`}>
                {phase.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Exercise Stage & Interactive Player */}
      <div className="rounded-2xl bg-[#14181f] border border-[#252b36] p-6 lg:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Timer & Breathing Circle (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-[#0e1116] border border-[#1e242e]">
            
            {/* Interactive Breathing Visualizer if in Phase 2 */}
            {currentExercise.phase === 'respiracion' ? (
              <div className="relative w-48 h-48 flex items-center justify-center my-2">
                <div
                  className={`w-40 h-40 rounded-full border-2 border-[#6f97ff] flex items-center justify-center transition-all duration-[5500ms] ease-in-out ${
                    breathPhase === 'Inhala'
                      ? 'scale-110 bg-[#1a2647]/50 shadow-[0_0_30px_rgba(111,151,255,0.2)]'
                      : 'scale-90 bg-[#0d1014]'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-xs uppercase tracking-widest text-[#8b94a3] font-semibold">
                      Coherencia 365
                    </span>
                    <div className="text-2xl font-bold font-display text-[#f3f4f6] mt-1">
                      {breathPhase}
                    </div>
                    <span className="text-[11px] text-[#6f97ff] font-mono-num">
                      5.5s · Ritmo VFC
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-48 h-48 flex items-center justify-center my-2">
                {/* SVG Progress Circle */}
                <svg className="w-44 h-44 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#1e242e"
                    strokeWidth="6"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="#c49b66"
                    strokeWidth="6"
                    strokeDasharray={276.46}
                    strokeDashoffset={
                      276.46 * (1 - secondsRemaining / (currentExercise.durationSeconds || 1))
                    }
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-bold font-mono-num text-[#f3f4f6]">
                    {formatTime(secondsRemaining)}
                  </span>
                  <span className="text-xs text-[#8b94a3] mt-1 font-serif-tcm">
                    {currentExercise.chineseName}
                  </span>
                </div>
              </div>
            )}

            {/* Player Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => {
                  if (activeExerciseIndex > 0) goToExercise(activeExerciseIndex - 1);
                }}
                disabled={activeExerciseIndex === 0}
                className="w-10 h-10 rounded-lg border border-[#252b36] hover:border-[#3a4250] bg-[#161a21] text-[#98a2b3] hover:text-[#f3f4f6] disabled:opacity-30 flex items-center justify-center transition-colors"
                title="Ejercicio anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="px-6 py-2.5 rounded-lg bg-[#c49b66] hover:bg-[#b08753] text-[#0d1014] font-bold text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pausar' : 'Comenzar'}</span>
              </button>

              <button
                onClick={resetTimer}
                className="w-10 h-10 rounded-lg border border-[#252b36] hover:border-[#3a4250] bg-[#161a21] text-[#98a2b3] hover:text-[#f3f4f6] flex items-center justify-center transition-colors"
                title="Reiniciar ejercicio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (activeExerciseIndex < EXERCISE_DATABASE.length - 1) {
                    goToExercise(activeExerciseIndex + 1);
                  }
                }}
                disabled={activeExerciseIndex === EXERCISE_DATABASE.length - 1}
                className="w-10 h-10 rounded-lg border border-[#252b36] hover:border-[#3a4250] bg-[#161a21] text-[#98a2b3] hover:text-[#f3f4f6] disabled:opacity-30 flex items-center justify-center transition-colors"
                title="Siguiente ejercicio"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* AI Posture Check Shortcut Button */}
            {onOpenVisionWithExercise && (
              <button
                onClick={() => onOpenVisionWithExercise(currentExercise.name)}
                className="mt-4 w-full py-2 px-3 rounded-lg bg-[#1a202a] hover:bg-[#222a38] border border-[#2e3746] text-xs font-medium text-[#c49b66] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Evaluar Postura en este Ejercicio con IA</span>
              </button>
            )}
          </div>

          {/* Right Column: Biomechanical & TCM Clinical Details (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Title & Meridian Tag */}
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8b94a3] mb-1">
                {getPhaseIcon(currentExercise.phase)}
                <span className="capitalize">{currentExercise.phase}</span>
                <span aria-hidden="true">·</span>
                <span>{currentExercise.pinyin}</span>
                {currentExercise.repCount && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#f3f4f6] font-medium font-mono-num">{currentExercise.repCount}</span>
                  </>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-[#f3f4f6]">
                {currentExercise.name}
              </h2>
              <div className="text-xs text-[#c49b66] mt-0.5 font-serif-tcm">
                Meridiano: {currentExercise.targetMeridian}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#e7eaef] leading-relaxed">
              {currentExercise.primaryBenefit}
            </p>

            {/* Postural Alignment Checklist */}
            <div className="p-3.5 rounded-xl bg-[#161a21] border border-[#252b36]">
              <div className="text-xs font-semibold text-[#f3f4f6] mb-2">
                Claves de Alineación Biomecánica:
              </div>
              <ul className="space-y-1.5">
                {currentExercise.keyPostureAlignment.map((cue, idx) => (
                  <li key={idx} className="text-xs text-[#98a2b3] flex items-start gap-2">
                    <span className="text-[#34d399] font-bold">✓</span>
                    <span>{cue}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step Instructions */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#f3f4f6]">
                Instrucciones Paso a Paso:
              </div>
              <ol className="space-y-1 text-xs text-[#8b94a3] list-decimal list-inside leading-relaxed">
                {currentExercise.stepInstructions.map((step, idx) => (
                  <li key={idx}>
                    <span className="text-[#e7eaef]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Prevention & Error Warning Callout */}
            <div className="p-3 rounded-xl bg-[#3a2a08]/40 border border-[#fbbf24]/30 text-xs text-[#fbbf24] flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Error Frecuente:</strong> {currentExercise.commonMistake}
                <div className="mt-0.5 text-[#e7eaef]/80">
                  {currentExercise.preventionDetail}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
