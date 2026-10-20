import React, { useState, useEffect } from 'react';
import { CircadianClockInfo } from '../types';
import { Clock, Sun, Droplets, Heart, Sparkles, ChevronRight, Bell } from 'lucide-react';

interface CircadianWidgetProps {
  onSchedulePauseAlert?: (hour: number, label: string) => void;
}

export const CircadianWidget: React.FC<CircadianWidgetProps> = ({ onSchedulePauseAlert }) => {
  const [circadianData, setCircadianData] = useState<CircadianClockInfo | null>(null);
  const [showAllPhases, setShowAllPhases] = useState(false);
  const [pauseScheduled, setPauseScheduled] = useState(false);

  useEffect(() => {
    fetch('/api/circadian/status')
      .then((res) => res.json())
      .then((data) => setCircadianData(data))
      .catch((err) => console.error('Error fetching circadian info:', err));
  }, []);

  if (!circadianData) {
    return (
      <div className="py-6 px-5 rounded-2xl bg-[#161a21] border border-[#252b36] animate-pulse">
        <div className="h-4 w-48 bg-[#252b36] rounded mb-3"></div>
        <div className="h-6 w-72 bg-[#252b36] rounded"></div>
      </div>
    );
  }

  const { activePhase, nextPhase, currentHour } = circadianData;

  const handleSchedulePause = () => {
    setPauseScheduled(true);
    if (onSchedulePauseAlert) {
      onSchedulePauseAlert(activePhase.hours[1] || 12, `Pausa de Vitalidad: ${activePhase.organ}`);
    }
    setTimeout(() => setPauseScheduled(false), 4000);
  };

  return (
    <div className="rounded-2xl bg-[#14181f] border border-[#252b36] p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#252b36]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#8b94a3] mb-1">
            <Clock className="w-3.5 h-3.5 text-[#c49b66]" />
            <span>Reloj Biológico Chino · Zi Wu Liu Zhu (子午流注)</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-num text-[#c49b66]">{currentHour}:00h Local</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-[#f3f4f6] flex items-center gap-2">
            Hora del {activePhase.organ}
            <span className="text-sm font-serif-tcm text-[#c49b66] font-normal">
              ({activePhase.pinyin} · Elemento {activePhase.element})
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSchedulePause}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all flex items-center gap-2 ${
              pauseScheduled
                ? 'bg-[#0e2e24] border-[#34d399] text-[#34d399]'
                : 'bg-[#1c222c] border-[#2e3746] hover:border-[#3a4250] text-[#e7eaef]'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-[#c49b66]" />
            {pauseScheduled ? 'Alerta Programada' : 'Programar Pausa Órgano'}
          </button>
          
          <button
            onClick={() => setShowAllPhases(!showAllPhases)}
            className="px-3 py-2 text-xs font-medium text-[#98a2b3] hover:text-[#f3f4f6] rounded-lg hover:bg-[#1a202a] transition-colors"
          >
            {showAllPhases ? 'Ocultar 12 Horas' : 'Ver 12 Órganos'}
          </button>
        </div>
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        
        {/* Action & Vitality Recommendation */}
        <div className="p-4 rounded-xl bg-[#161a21] border border-[#252b36]">
          <div className="flex items-center gap-2 text-xs text-[#98a2b3] mb-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-[#c49b66]" />
            <span>Acción Biomecánica & Emocional Recomendada</span>
          </div>
          <p className="text-sm text-[#e7eaef] leading-relaxed">
            {activePhase.action}
          </p>
        </div>

        {/* Jin Ye Liquid Focus */}
        <div className="p-4 rounded-xl bg-[#161a21] border border-[#252b36]">
          <div className="flex items-center gap-2 text-xs text-[#98a2b3] mb-1.5 font-medium">
            <Droplets className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>Gestión de Líquidos Jin Ye (津液)</span>
          </div>
          <p className="text-sm text-[#e7eaef] leading-relaxed">
            {activePhase.liquidFocus}
          </p>
        </div>

      </div>

      {/* Next Phase Preview Strip */}
      <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#8b94a3] border-t border-[#1e242e]">
        <span>
          Próxima fase ({nextPhase.hours[0]}:00h - {nextPhase.hours[1]}:59h):{' '}
          <strong className="text-[#e7eaef] font-medium">{nextPhase.organ}</strong> ({nextPhase.element})
        </span>
        <span className="text-[#c49b66] italic font-serif-tcm">Armonía circadiana</span>
      </div>

      {/* Collapsible 12 Organ Clock Reference Table */}
      {showAllPhases && (
        <div className="mt-5 pt-4 border-t border-[#252b36] overflow-x-auto">
          <h3 className="text-sm font-semibold text-[#f3f4f6] mb-3">
            Ciclo Completo de los 12 Meridianos (Horario de Órganos MTC)
          </h3>
          <table className="w-full text-left text-xs text-[#98a2b3] border-collapse">
            <thead>
              <tr className="border-b border-[#252b36] text-[#8b94a3]">
                <th className="py-2 pr-3">Horario</th>
                <th className="py-2 px-3">Órgano</th>
                <th className="py-2 px-3">Elemento</th>
                <th className="py-2 pl-3">Propósito en Salud Postural y Vitalidad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e242e]">
              {[
                { h: '03:00 - 05:00', o: 'Pulmón (Fei)', e: 'Metal', d: 'Difusión de Qi y líquidos a la piel y fascias.' },
                { h: '05:00 - 07:00', o: 'Intestino Grueso (Da Chang)', e: 'Metal', d: 'Evacuación y despertar del peristaltismo.' },
                { h: '07:00 - 09:00', o: 'Estómago (Wei)', e: 'Tierra', d: 'Nutrición óptima y ventana canónica para la rutina de 22 minutos.' },
                { h: '09:00 - 11:00', o: 'Bazo (Pi)', e: 'Tierra', d: 'Transformación de fluidos en músculos y tejido conectivo.' },
                { h: '11:00 - 13:00', o: 'Corazón (Xin)', e: 'Fuego', d: 'Circulación sanguínea alta. Momento clave para pausa mental de 15m.' },
                { h: '13:00 - 15:00', o: 'Intestino Delgado', e: 'Fuego', d: 'Separación de fluidos claros y turbios.' },
                { h: '15:00 - 17:00', o: 'Vejiga (Pang Guang)', e: 'Agua', d: 'Elongación del meridiano dorsal Taiyang y descarga lumbar.' },
                { h: '17:00 - 19:00', o: 'Riñón (Shen)', e: 'Agua', d: 'Preservación de energía Jing y solidez de columna vertebral.' },
                { h: '19:00 - 21:00', o: 'Pericardio (Xin Bao)', e: 'Fuego', d: 'Protección emocional, respiración serena y descanso lumbar.' },
                { h: '21:00 - 23:00', o: 'Triple Recalentador', e: 'Fuego Min.', d: 'Armonización térmica de los 3 calderos de líquidos.' },
                { h: '23:00 - 01:00', o: 'Vesícula Biliar', e: 'Madera', d: 'Regeneración celular profunda durante el sueño.' },
                { h: '01:00 - 03:00', o: 'Hígado (Gan)', e: 'Madera', d: 'Purificación hematológica y descanso de tendones y ligamentos.' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-[#1a202a]">
                  <td className="py-2 pr-3 font-mono-num text-[#c49b66]">{row.h}</td>
                  <td className="py-2 px-3 font-medium text-[#f3f4f6]">{row.o}</td>
                  <td className="py-2 px-3">{row.e}</td>
                  <td className="py-2 pl-3 text-[#e7eaef]">{row.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
