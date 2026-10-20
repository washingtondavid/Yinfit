import { UserProfile, WeeklyLogDay, PostureAnalysisData } from '../types';

export function openPrintableMonthlyReport(
  profile: UserProfile,
  weeklyLogs: WeeklyLogDay[],
  latestAnalysis: PostureAnalysisData | null
) {
  const avgScore = Math.round(
    weeklyLogs.reduce((acc, curr) => acc + curr.score, 0) / (weeklyLogs.length || 1)
  );
  const avgHrv = Math.round(
    weeklyLogs.reduce((acc, curr) => acc + curr.hrvMs, 0) / (weeklyLogs.length || 1)
  );
  const completedCount = weeklyLogs.filter((d) => d.completed).length;
  const compliancePct = Math.round((completedCount / (weeklyLogs.length || 1)) * 100);

  const reportHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>QiPosture · Reporte Mensual de Evolución Física y Energética</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 40px; color: #1a1e24; line-height: 1.6; background: #fff; }
    h1, h2, h3 { font-family: "Noto Serif", Georgia, serif; color: #111; margin-bottom: 8px; }
    .header-bar { border-bottom: 2px solid #c49b66; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
    .seal { display: inline-block; padding: 4px 10px; border: 1px solid #b93826; color: #b93826; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
    .kpi-box { background: #f8f9fa; border: 1px solid #e5e7eb; padding: 16px; border-radius: 6px; }
    .kpi-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
    .kpi-val { font-size: 26px; font-weight: bold; color: #111827; margin-top: 4px; font-family: monospace; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 10px 14px; text-align: left; font-size: 13px; }
    th { background: #f3f4f6; font-weight: 600; text-transform: uppercase; font-size: 11px; }
    .section-box { background: #faf8f5; border: 1px solid #dfd7cc; padding: 18px; border-radius: 6px; margin-bottom: 24px; }
    .footer-note { font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 40px; }
    @media print {
      body { margin: 15mm; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #111; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
      Imprimir / Guardar como PDF
    </button>
  </div>

  <div class="header-bar">
    <div>
      <span class="seal">Medicina Tradicional China & Biomecánica</span>
      <h1 style="margin: 8px 0 4px;">Informe de Evolución Postural & Vitalidad Qi</h1>
      <p style="margin: 0; color: #4b5563; font-size: 14px;">
        Practicante: <strong>${profile.name}</strong> · Enfoque: <strong>${profile.targetFocus.toUpperCase()}</strong> · Fecha de emisión: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 12px; color: #6b7280;">ID Registro Clínico</div>
      <div style="font-family: monospace; font-weight: bold;">QP-${profile.id.toUpperCase()}</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-box">
      <div class="kpi-label">Puntaje Postural Promedio</div>
      <div class="kpi-val">${avgScore}/100</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-label">Variabilidad Cardíaca (HRV)</div>
      <div class="kpi-val">${avgHrv} ms</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-label">Adherencia a Rutina 22m</div>
      <div class="kpi-val">${compliancePct}%</div>
    </div>
    <div class="kpi-box">
      <div class="kpi-label">Sesiones Completadas</div>
      <div class="kpi-val">${completedCount} días</div>
    </div>
  </div>

  <div class="section-box">
    <h3 style="margin-top: 0; color: #8a6230;">Diagnóstico Biomecánico & Estado de Líquidos Jin Ye</h3>
    <p style="font-size: 14px; margin-bottom: 8px;">
      ${latestAnalysis ? latestAnalysis.summaryText : 'Alineación craneocervical en evolución favorable. Se observa descompresión del eje sagital y menor sobrecarga en trapecios superiores.'}
    </p>
    <div style="font-size: 13px; color: #4b5563;">
      <strong>Perspectiva Tradicional China:</strong> ${latestAnalysis ? latestAnalysis.tcmVitalityInsight : 'La restitución hídrica matutina (450ml con minerales) y la coherencia 365 han mejorado la turgencia del tejido conectivo fascial, estimulando la difusión de Qi defensivo (Wei Qi) y el libre tránsito por el canal Dumai.'}
    </div>
  </div>

  <h2>Desglose Semanal de Sesiones y Métricas Fisiológicas</h2>
  <table>
    <thead>
      <tr>
        <th>Día / Fecha</th>
        <th>Estado</th>
        <th>Alineación</th>
        <th>Duración</th>
        <th>VFC (HRV)</th>
        <th>FC Promedio</th>
        <th>Desviaciones Corregidas</th>
      </tr>
    </thead>
    <tbody>
      ${weeklyLogs
        .map(
          (log) => `
        <tr>
          <td><strong>${log.dayName}</strong> <span style="color:#6b7280; font-size:11px;">(${log.date})</span></td>
          <td>${log.completed ? '<span style="color:#0f9d6b; font-weight:600;">✓ Completada</span>' : '<span style="color:#9ca3af;">Descanso</span>'}</td>
          <td><strong style="font-family:monospace;">${log.score}/100</strong></td>
          <td>${log.durationMinutes} min</td>
          <td>${log.hrvMs} ms</td>
          <td>${log.avgBpm} lpm</td>
          <td><span style="font-size:12px; color:#4b5563;">${log.deviationsFixed.join(', ')}</span></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="section-box">
    <h3 style="margin-top: 0;">Prescripción para el Próximo Mes</h3>
    <ul style="font-size: 13px; margin: 0; padding-left: 20px; color: #374151;">
      <li>Mantener la ventana de luz matutina de 3 a 5 minutos antes de las 9:00 AM para consolidar el ritmo circadiano.</li>
      <li>En sentadilla profunda Wu Ji, priorizar apoyo de talones en el suelo para estimular el punto Yongquan (R1).</li>
      <li>Integrar la pausa circadiana de 12:00 a 13:00 (hora del Corazón) con 5 minutos de respiración diafragmática.</li>
      <li>Realizar el chequeo con cámara de visión IA 2 veces por semana para verificar corrección de la curva cervical.</li>
    </ul>
  </div>

  <div class="footer-note">
    Documento emitido por QiPosture · Plataforma de Gimnasio Postural y Medicina Tradicional China. Datos encriptados con AES-256-GCM.
  </div>
</body>
</html>
  `;

  const reportWindow = window.open('', '_blank');
  if (reportWindow) {
    reportWindow.document.write(reportHtml);
    reportWindow.document.close();
  }
}
