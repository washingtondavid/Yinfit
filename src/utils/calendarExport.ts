// Generates iCalendar (.ics) files for syncing daily Chinese morning vitality routines and circadian pauses

export function generateRoutineICalendar(routineHour: number = 7, routineMinute: number = 0): string {
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  const now = new Date();
  const dtStamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}T${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}Z`;

  // Start date tomorrow at selected time
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1);
  startDate.setHours(routineHour, routineMinute, 0, 0);

  const endDate = new Date(startDate.getTime() + 22 * 60 * 1000); // 22 minutes duration

  const dtStart = `${startDate.getFullYear()}${pad(startDate.getMonth() + 1)}${pad(startDate.getDate())}T${pad(startDate.getHours())}${pad(startDate.getMinutes())}00`;
  const dtEnd = `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}T${pad(endDate.getHours())}${pad(endDate.getMinutes())}00`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//QiPosture//Rutina Matutina Medicina China//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:QiPosture · Rutina Matutina 22 Min',
    'X-WR-TIMEZONE:UTC',
    'BEGIN:VEVENT',
    `UID:qiposture-${Date.now()}@qiposture.app`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'RRULE:FREQ=DAILY;INTERVAL=1',
    'SUMMARY:QiPosture · Rutina Matutina 22 min (Jin Ye & Alineación)',
    'DESCRIPTION:Secuencia canónica fisiológica china: 1. Hidratar 450ml agua tibia + sal (2m) \\n2. Respiración Coherencia 365 (5m) \\n3. Movilidad y dragón espinal (7m) \\n4. Drenaje linfático centrípeto (5m) \\n5. Luz matutina ventana (3m).',
    'LOCATION:Esterilla / Espacio despejado matutino',
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio: En 15 min inicia tu rutina de vitalidad QiPosture',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadCalendarFile(filename: string = 'qiposture_rutina_diaria.ics') {
  const content = generateRoutineICalendar();
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
