import React, { useState } from 'react';
import { WeeklyLogDay, UserProfile, PostureAnalysisData } from '../types';
import { Calendar, TrendingUp, CheckCircle, Heart, Download, FileText, Activity, ShieldCheck } from 'lucide-react';
import { downloadCalendarFile } from '../utils/calendarExport';
import { openPrintableMonthlyReport } from '../utils/reportGenerator';

interface WeeklyTrackerProps {
  weeklyLogs: WeeklyLogDay[];
  onToggleDay: (date: string) => void;
  activeProfile: UserProfile;
  latestAnalysis: PostureAnalysisData | null;
}

export const WeeklyTracker: React.FC<WeeklyTrackerProps> = ({
  weeklyLogs,
  onToggleDay,
  activeProfile,
  latestAnalysis,
}) => {
  const [selectedDay, setSelectedDay] = useState<WeeklyLogDay>(weeklyLogs[weeklyLogs.length - 1]);

  const completedCount = weeklyLogs.filter((d) => d.completed).length;
  const avgScore = Math.round(
    weeklyLogs.reduce((acc, curr) => acc + curr.score, 0) / (weeklyLogs.length || 1)
  );
  const avgHrv = Math.round(
    weeklyLogs.reduce((acc, curr) => acc + curr.hrvMs, 0) / (weeklyLogs.length || 1)
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Action Buttons */}
      <div className="rounded-2xl bg-[#14181f] border border-[#252b36] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8b94a3] mb-1">
            <span>Rastreador de Desviaciones</span>
            <span aria-hidden="true">·</span>
            <span>Semana en Curso</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#34d399]">{completedCount}/7 Días Cumplidos</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#f3f4f6]">
            Evolución Postural & Sincronía Fisiológica
          </h2>
          <p className="text-xs sm:text-sm text-[#98a2b3] mt-1 max-w-xl">
            Monitoreo continuo de correcciones biomecánicas, variabilidad cardíaca (HRV) y drenaje de fluidos Jin Ye para {activeProfile.name}.
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => openPrintableMonthlyReport(activeProfile, weeklyLogs, latestAnalysis)}
            className="px-3.5 py-2 rounded-lg bg-[#c49b66] hover:bg-[#b08753] text-[#0d1014] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Exportar Reporte Mensual</span>
          </button>

          <button
            onClick={() => downloadCalendarFile()}
            className="px-3 py-2 rounded-lg bg-[#1c222c] hover:bg-[#222a38] border border-[#2e3746] text-[#e7eaef] text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-4 h-4 text-[#c49b66]" />
            <span>Sincronizar Calendario (.ics)</span>
          </button>
        </div>
      </div>

      {/* 4-KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#161a21] border border-[#252b36]">
          <div className="text-xs text-[#8b94a3] uppercase tracking-wider font-semibold">
            Puntaje Promedio
          </div>
          <div className="text-2xl font-bold font-mono-num text-[#f3f4f6] mt-1">
            {avgScore}<span className="text-xs font-normal text-[#8b94a3]">/100</span>
          </div>
          <div className="text-[11px] text-[#34d399] mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+8% corrección de lordosis</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#161a21] border border-[#252b36]">
          <div className="text-xs text-[#8b94a3] uppercase tracking-wider font-semibold">
            VFC / HRV Media
          </div>
          <div className="text-2xl font-bold font-mono-num text-[#6f97ff] mt-1">
            {avgHrv}<span className="text-xs font-normal text-[#8b94a3]"> ms</span>
          </div>
          <div className="text-[11px] text-[#8b94a3] mt-1">
            Tono vagal óptimo al despertar
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#161a21] border border-[#252b36]">
          <div className="text-xs text-[#8b94a3] uppercase tracking-wider font-semibold">
            Frecuencia Cardíaca
          </div>
          <div className="text-2xl font-bold font-mono-num text-[#f87171] mt-1">
            62<span className="text-xs font-normal text-[#8b94a3]"> lpm</span>
          </div>
          <div className="text-[11px] text-[#34d399] mt-1">
            Ritmo reposo en respiración 365
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#161a21] border border-[#252b36]">
          <div className="text-xs text-[#8b94a3] uppercase tracking-wider font-semibold">
            Desviaciones Sanadas
          </div>
          <div className="text-2xl font-bold font-mono-num text-[#c49b66] mt-1">
            4<span className="text-xs font-normal text-[#8b94a3]"> patrones</span>
          </div>
          <div className="text-[11px] text-[#8b94a3] mt-1">
            Cervical, escapular y pélvica
          </div>
        </div>
      </div>

      {/* Week Day Selector Strip */}
      <div className="rounded-2xl bg-[#14181f] border border-[#252b36] p-5">
        <h3 className="text-sm font-semibold text-[#f3f4f6] mb-3">
          Registro Diario de la Semana
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
          {weeklyLogs.map((log) => {
            const isSelected = selectedDay.date === log.date;
            return (
              <button
                key={log.date}
                onClick={() => setSelectedDay(log)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#1c222c] border-[#c49b66] shadow-sm'
                    : 'bg-[#161a21] border-[#252b36] hover:border-[#3a4250]'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#f3f4f6]">{log.dayName}</span>
                  <input
                    type="checkbox"
                    checked={log.completed}
                    onChange={(e) => {
                      e.stopPropagation();
                      onToggleDay(log.date);
                    }}
                    className="w-4 h-4 rounded text-[#c49b66] accent-[#c49b66] cursor-pointer"
                  />
                </div>
                <div className="text-xs text-[#8b94a3]">{log.date}</div>
                <div className="mt-2 text-xs font-mono-num font-bold text-[#c49b66]">
                  {log.score}/100
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Details Card */}
        {selectedDay && (
          <div className="mt-5 pt-5 border-t border-[#252b36] grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#161a21] border border-[#252b36] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#8b94a3]">
                <span>Detalle del {selectedDay.dayName}</span>
                <span className="font-mono-num">{selectedDay.durationMinutes} min de práctica</span>
              </div>
              <div className="text-base font-semibold text-[#f3f4f6]">
                Puntaje de Simetría: {selectedDay.score}/100
              </div>
              <div className="text-xs text-[#98a2b3]">
                Frecuencia cardíaca media: <strong className="text-[#f3f4f6] font-mono-num">{selectedDay.avgBpm} lpm</strong> · Variabilidad HRV: <strong className="text-[#6f97ff] font-mono-num">{selectedDay.hrvMs} ms</strong>
              </div>
              <div className="text-xs text-[#8b94a3]">
                Fases completadas: <span className="text-[#e7eaef] capitalize">{selectedDay.phasesDone.join(', ')}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#161a21] border border-[#252b36] space-y-2">
              <div className="text-xs text-[#8b94a3]">
                Desviaciones Posturales Corregidas en la Sesión:
              </div>
              <div className="space-y-1">
                {selectedDay.deviationsFixed.map((dev, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-[#34d399]"
                  >
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[#e7eaef]">{dev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
