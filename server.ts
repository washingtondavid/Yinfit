import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI with recommended telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// TCM Chinese Organ Clock (12 Shichen / 时辰) Reference
const TCM_ORGAN_CLOCK = [
  { hours: [23, 0], organ: 'Vesícula Biliar', pinyin: 'Dan', element: 'Madera', action: 'Regeneración celular y descanso profundo de la mente (Shen)', liquidFocus: 'Consolidación de esencia Jing' },
  { hours: [1, 2], organ: 'Hígado', pinyin: 'Gan', element: 'Madera', action: 'Desintoxicación y purificación de la sangre', liquidFocus: 'Distribución y almacenamiento de sangre y Jin Ye' },
  { hours: [3, 4], organ: 'Pulmón', pinyin: 'Fei', element: 'Metal', action: 'Distribución de Qi respiratorio y líquidos a la piel y fascias', liquidFocus: 'Apertura de poros y difusión de Qi protector (Wei Qi)' },
  { hours: [5, 6], organ: 'Intestino Grueso', pinyin: 'Da Chang', element: 'Metal', action: 'Evacuación matutina y despertar peristáltico', liquidFocus: 'Absorción de agua y sal para reposición del volumen plasmático' },
  { hours: [7, 8], organ: 'Estómago', pinyin: 'Wei', element: 'Tierra', action: 'Digestión y nutrición óptima. Momento ideal para rutina física matutina', liquidFocus: 'Hidratación templada para mucosa digestiva' },
  { hours: [9, 10], organ: 'Bazo-Páncreas', pinyin: 'Pi', element: 'Tierra', action: 'Transformación de fluidos y tonificación muscular', liquidFocus: 'Transporte de Jin Ye a los cuatro miembros' },
  { hours: [11, 12], organ: 'Corazón', pinyin: 'Xin', element: 'Fuego', action: 'Circulación sanguínea máxima y serenidad mental', liquidFocus: 'Pausa breve (Siesta de 15 min / pausa circadiana sin pantallas)' },
  { hours: [13, 14], organ: 'Intestino Delgado', pinyin: 'Xiao Chang', element: 'Fuego', action: 'Separación de lo puro y lo impuro en fluidos', liquidFocus: 'Asimilación de nutrientes e hidratación ligera' },
  { hours: [15, 16], organ: 'Vejiga', pinyin: 'Pang Guang', element: 'Agua', action: 'Drenaje urinario y elongación del meridiano dorsal Taiyang', liquidFocus: 'Drenaje de líquidos acumulados en piernas' },
  { hours: [17, 18], organ: 'Riñón', pinyin: 'Shen', element: 'Agua', action: 'Reserva de vitalidad y fortalecimiento lumbar/postural', liquidFocus: 'Regulación osmótica y preservación de calor lumbar' },
  { hours: [19, 20], organ: 'Pericardio / Maestro Corazón', pinyin: 'Xin Bao', element: 'Fuego', action: 'Protección emocional, respiración diafragmática suave y estiramientos', liquidFocus: 'Descarga del sistema nervioso simpático' },
  { hours: [21, 22], organ: 'Triple Recalentador (San Jiao)', pinyin: 'San Jiao', element: 'Fuego Ministerial', action: 'Armonización de los 3 calderos de fluidos corporales', liquidFocus: 'Transición al sueño, atenuación lumínica y meditación' },
];

// Endpoint: Current Circadian TCM Organ Clock Status
app.get('/api/circadian/status', (_req: Request, res: Response) => {
  const now = new Date();
  const currentHour = now.getHours();

  const activePhase = TCM_ORGAN_CLOCK.find((item) => item.hours.includes(currentHour)) || TCM_ORGAN_CLOCK[0];
  const nextHourIndex = (TCM_ORGAN_CLOCK.indexOf(activePhase) + 1) % TCM_ORGAN_CLOCK.length;
  const nextPhase = TCM_ORGAN_CLOCK[nextHourIndex];

  res.json({
    currentHour,
    activePhase,
    nextPhase,
    timestamp: now.toISOString(),
    recommendedAction: activePhase.action,
    liquidVitalityTip: activePhase.liquidFocus,
  });
});

// Endpoint: AI-based Posture & Alignment Evaluation using Gemini
app.post('/api/posture/analyze', async (req: Request, res: Response) => {
  try {
    const { imageBase64, exerciseId, exerciseName, userFocus, profileName } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Se requiere la imagen en base64 para el análisis.' });
    }

    // Clean base64 string
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const promptText = `
Eres un Maestro de Daoyin / Qigong Biomecánico y Especialista Senior en Ergonomía y Alineación Postural Deportiva con base en la Medicina Tradicional China (MTC) y Fisioterapia Moderna.
Analiza la imagen adjunta donde el practicante (${profileName || 'Usuario'}) está ejecutando el ejercicio postural: "${exerciseName || exerciseId || 'Postura Wu Ji / Movilidad / Estiramiento Chino'}".
Enfoque particular del usuario: ${userFocus || 'Alineación general, corrección de desviaciones cervicales/lumbares y fluidez de líquidos Jin Ye'}.

Examina con máxima precisión biomecánica:
1. Alineación de cabeza y cuello (ángulo cervicotorácico, protrusión de barbilla / 'Forward Head Posture').
2. Nivel y retracción de hombros y escápulas (asimetrías, elevación de trapecios, rotación interna).
3. Eje axial de la columna vertebral (neutralidad lumbar, curvatura dorsal, cifosis/lordosis excesiva).
4. Estabilidad y simetría pélvica (anteversión/retroversión pélvica, nivelación de crestas ilíacas).
5. Apoyo y articulación de miembros inferiores (rodillas respecto a punta de pies, distribución del peso en puntos Yongquan K1).
6. Prevención de lesiones específicas a largo plazo.
7. Conexión de medicina tradicional china: cómo esta postura influye en el flujo del Qi, la descompresión del meridiano Dumai (Gobernador), canal Taiyang (Vejiga) y el bombeo de líquidos corporales (Jin Ye / linfa).

Devuelve los hallazgos en formato JSON estricto.
`;

    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data,
      },
    };

    const textPart = {
      text: promptText,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: {
              type: Type.NUMBER,
              description: 'Puntaje de alineación global entre 0 y 100',
            },
            postureGrade: {
              type: Type.STRING,
              description: 'Grado: Excelente, Buena, Desviación Moderada, o Requiere Corrección Inmediata',
            },
            summaryText: {
              type: Type.STRING,
              description: 'Resumen ejecutivo de 2 oraciones del estado postural en este instante',
            },
            alignmentAnalysis: {
              type: Type.OBJECT,
              properties: {
                headAndNeck: { type: Type.STRING, description: 'Estado de cabeza, mentón y cervicales' },
                shouldersAndScapula: { type: Type.STRING, description: 'Estado escapular y hombros' },
                spineAndThorax: { type: Type.STRING, description: 'Eje axial columna y caja torácica' },
                pelvisAndHips: { type: Type.STRING, description: 'Inclinación pélvica y caderas' },
                kneesAndFeet: { type: Type.STRING, description: 'Alineación de rodillas y pies' },
              },
              required: ['headAndNeck', 'shouldersAndScapula', 'spineAndThorax', 'pelvisAndHips', 'kneesAndFeet'],
            },
            deviationsIdentified: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lista de desviaciones biomecánicas detectadas en la toma',
            },
            realtimeCorrectionCues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 a 4 instrucciones verbales inmediatas para corregir la postura en tiempo real',
            },
            injuryPreventionWarning: {
              type: Type.STRING,
              description: 'Qué lesión previene corregir esta postura (ej. compresión discal C5-C6, pinzamiento subacromial, sobrecarga lumbar L5-S1)',
            },
            tcmVitalityInsight: {
              type: Type.STRING,
              description: 'Explicación del beneficio según la medicina tradicional china (meridianos, circulación de Jin Ye, armonía de Qi)',
            },
            keypointsOverlay: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: 'Punto anatómico (ej: Coronilla Baihui, Hombro Izq, Hombro Der, Pelvis, Rodilla)' },
                  xPercent: { type: Type.NUMBER, description: 'Coordenada horizontal estimada en porcentaje (0-100)' },
                  yPercent: { type: Type.NUMBER, description: 'Coordenada vertical estimada en porcentaje (0-100)' },
                  status: { type: Type.STRING, description: 'aligned, warning, o deviated' },
                },
                required: ['label', 'xPercent', 'yPercent', 'status'],
              },
              description: 'Puntos clave detectados para dibujar el esqueleto o indicadores visuales sobre la imagen',
            },
          },
          required: [
            'overallScore',
            'postureGrade',
            'summaryText',
            'alignmentAnalysis',
            'deviationsIdentified',
            'realtimeCorrectionCues',
            'injuryPreventionWarning',
            'tcmVitalityInsight',
            'keypointsOverlay',
          ],
        },
      },
    });

    const outputText = response.text || '{}';
    const analysisResult = JSON.parse(outputText);

    res.json({
      success: true,
      analysis: analysisResult,
      timestamp: new Date().toISOString(),
      exerciseId,
    });
  } catch (error: any) {
    console.error('Error al analizar postura con Gemini:', error);
    res.status(500).json({
      error: 'No se pudo completar el análisis visual de postura.',
      details: error?.message || 'Error de procesamiento con el modelo de visión.',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`QiPosture Server running at http://localhost:${port}`);
  });
}

startServer();
