export interface UserProfile {
  id: string;
  name: string;
  avatarSeed: string;
  targetFocus: 'cervical' | 'hipercifosis' | 'lumbar' | 'vitalidad_liquidos' | 'equilibrio_general';
  customGoals: string[];
  postureBaselineScore: number;
  createdAt: string;
  updatedAt: string;
}

export type RoutinePhase = 'agua' | 'respiracion' | 'movilidad' | 'drenaje' | 'luz';

export interface ExerciseItem {
  id: string;
  name: string;
  chineseName: string;
  pinyin: string;
  phase: RoutinePhase;
  phaseOrder: number;
  durationSeconds: number;
  targetMeridian: string;
  primaryBenefit: string;
  keyPostureAlignment: string[];
  commonMistake: string;
  preventionDetail: string;
  stepInstructions: string[];
  repCount?: string;
}

export interface PostureAnalysisData {
  overallScore: number;
  postureGrade: string;
  summaryText: string;
  alignmentAnalysis: {
    headAndNeck: string;
    shouldersAndScapula: string;
    spineAndThorax: string;
    pelvisAndHips: string;
    kneesAndFeet: string;
  };
  deviationsIdentified: string[];
  realtimeCorrectionCues: string[];
  injuryPreventionWarning: string;
  tcmVitalityInsight: string;
  keypointsOverlay: Array<{
    label: string;
    xPercent: number;
    yPercent: number;
    status: 'aligned' | 'warning' | 'deviated';
  }>;
}

export interface WeeklyLogDay {
  date: string;
  dayName: string;
  completed: boolean;
  score: number;
  durationMinutes: number;
  hrvMs: number;
  avgBpm: number;
  deviationsFixed: string[];
  phasesDone: RoutinePhase[];
}

export interface CircadianClockInfo {
  currentHour: number;
  activePhase: {
    hours: number[];
    organ: string;
    pinyin: string;
    element: string;
    action: string;
    liquidFocus: string;
  };
  nextPhase: {
    hours: number[];
    organ: string;
    pinyin: string;
    element: string;
    action: string;
    liquidFocus: string;
  };
  timestamp: string;
  recommendedAction: string;
  liquidVitalityTip: string;
}

export interface WearableMetrics {
  bpm: number;
  hrv: number; // Heart Rate Variability (ms)
  stressLevel: 'Bajo (Equilibrio Yin-Yang)' | 'Moderado' | 'Elevado';
  fluidBalanceScore: number;
  deviceConnected: boolean;
  deviceName: string;
}
