import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, PostureAnalysisData } from '../types';
import { Camera, RefreshCw, AlertCircle, CheckCircle2, ShieldCheck, Sparkles, Upload, Eye, Activity } from 'lucide-react';

interface AIPostureCoachProps {
  activeProfile: UserProfile;
  onAnalysisComplete?: (analysis: PostureAnalysisData) => void;
}

export const AIPostureCoach: React.FC<AIPostureCoachProps> = ({
  activeProfile,
  onAnalysisComplete,
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<PostureAnalysisData | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string>('Wu Ji · Postura de Alineación Universal');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Start webcam
  const startCamera = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn('No se pudo acceder a la cámara:', err);
      setErrorMessage(
        'Acceso a cámara no disponible en este dispositivo. Puedes usar las muestras fotográficas o subir tu propia foto para el análisis con IA.'
      );
      setCameraActive(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Draw overlay keypoints on result image canvas
  useEffect(() => {
    if (!analysisResult || !capturedImage || !overlayCanvasRef.current) return;
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = capturedImage;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Draw Chinese Dumai Plumb Line (Central balance axis)
      const centerX = img.width / 2;
      ctx.beginPath();
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(196, 155, 102, 0.7)';
      ctx.lineWidth = 2;
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, img.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw detected anatomical keypoints
      analysisResult.keypointsOverlay?.forEach((kp) => {
        const x = (kp.xPercent / 100) * img.width;
        const y = (kp.yPercent / 100) * img.height;

        let strokeColor = '#34d399'; // aligned
        if (kp.status === 'warning') strokeColor = '#fbbf24';
        if (kp.status === 'deviated') strokeColor = '#f87171';

        // Outer ring
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Inner solid core
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = strokeColor;
        ctx.fill();

        // Label tag
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(kp.label, x + 14, y + 4);
        ctx.shadowBlur = 0;
      });
    };
  }, [analysisResult, capturedImage]);

  // Capture frame from webcam
  const captureFrameAndAnalyze = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL('image/jpeg', 0.85);
    setCapturedImage(base64);
    analyzeImage(base64);
  };

  // Run Gemini Posture Analysis via server endpoint
  const analyzeImage = async (base64String: string) => {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/posture/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64String,
          exerciseName: selectedExercise,
          profileName: activeProfile.name,
          userFocus: activeProfile.targetFocus,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al comunicarse con el evaluador visual.');
      }

      setAnalysisResult(data.analysis);
      if (onAnalysisComplete) {
        onAnalysisComplete(data.analysis);
      }
    } catch (err: any) {
      console.error('Error al analizar postura:', err);
      setErrorMessage(err.message || 'No se pudo completar el análisis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Upload user custom image file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setCapturedImage(base64);
      analyzeImage(base64);
    };
    reader.readAsDataURL(file);
  };

  // Load sample posture silhouette
  const loadSampleSilhouette = () => {
    const samplePath = '/src/assets/images/tcm_posture_silhouette_1792528476442.jpg';
    setCapturedImage(samplePath);
    // Convert to base64 via canvas for API
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = samplePath;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        analyzeImage(dataUrl);
      }
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="rounded-2xl bg-[#14181f] border border-[#252b36] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8b94a3] mb-1">
              <span>Inteligencia Artificial Biomédica</span>
              <span aria-hidden="true">·</span>
              <span>Gemini Vision</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#34d399]">Correcciones en Tiempo Real</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-[#f3f4f6]">
              Evaluador de Alineación Postural & Eje Sagital
            </h2>
            <p className="text-sm text-[#98a2b3] mt-1 max-w-2xl">
              Evalúa en tiempo real el ángulo craneocervical, basculación escapular y neutralidad lumbar durante el ejercicio para prevenir lesiones articulares crónicas y optimizar el flujo de Jin Ye.
            </p>
          </div>

          {/* Exercise Selector */}
          <div className="shrink-0">
            <label className="block text-xs text-[#8b94a3] mb-1 font-medium">Ejercicio a Evaluar:</label>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-[#1c222c] border border-[#2e3746] text-[#f3f4f6] focus:outline-none focus:border-[#c49b66]"
            >
              <option value="Wu Ji · Postura de Alineación Universal">Wu Ji · Postura de Alineación Universal</option>
              <option value="Semicírculos Cervicales de la Grulla">Semicírculos Cervicales de la Grulla</option>
              <option value="Ondulación del Dragón (Gato-Camello)">Ondulación del Dragón (Gato-Camello)</option>
              <option value="Sentadilla Profunda de Descarga">Sentadilla Profunda de Descarga</option>
              <option value="Rotación Escapular y Apertura Torácica">Rotación Escapular y Apertura Torácica</option>
            </select>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-[#3a1414] border border-[#f87171]/40 text-xs text-[#f87171] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Camera & Visual Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Video Capture / Media Preview (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative rounded-2xl bg-[#090b0e] border border-[#252b36] overflow-hidden aspect-[4/3] flex items-center justify-center">
            
            {/* Live Camera View */}
            {cameraActive && (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                
                {/* Visual Bio-Mechanic Guidelines Overlay */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6">
                  {/* Plumb Line in Center */}
                  <div className="absolute inset-y-0 left-1/2 w-px border-l border-dashed border-[#c49b66]/60"></div>
                  {/* Eye Level Line */}
                  <div className="absolute inset-x-0 top-1/4 h-px border-t border-dashed border-[#22d3ee]/40"></div>
                  {/* Shoulder Level Line */}
                  <div className="absolute inset-x-0 top-1/3 h-px border-t border-dashed border-[#34d399]/40"></div>
                  {/* Pelvic Level Line */}
                  <div className="absolute inset-x-0 top-2/3 h-px border-t border-dashed border-[#fbbf24]/40"></div>

                  <div className="flex justify-between items-center text-[11px] text-[#e7eaef] bg-black/60 px-3 py-1 rounded-md backdrop-blur-sm self-start">
                    <span>Eje Sagital Dumai · Guía activa</span>
                  </div>
                </div>
              </>
            )}

            {/* Static Image / Analyzed Canvas View */}
            {!cameraActive && capturedImage && (
              <canvas
                ref={overlayCanvasRef}
                className="w-full h-full object-contain"
              />
            )}

            {/* Default Placeholder when neither camera nor image is active */}
            {!cameraActive && !capturedImage && (
              <div className="p-8 text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-[#161a21] border border-[#252b36] flex items-center justify-center mx-auto mb-4 text-[#c49b66]">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-[#f3f4f6] mb-1">
                  Cámara de Alineación Lista
                </h3>
                <p className="text-xs text-[#8b94a3] mb-5">
                  Activa tu cámara web para capturar tu postura en vivo o carga una fotografía de tu ejecución para un diagnóstico inmediato con IA.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-lg bg-[#c49b66] hover:bg-[#b08753] text-[#0d1014] text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4" />
                    Activar Cámara
                  </button>
                  <button
                    onClick={loadSampleSilhouette}
                    className="px-4 py-2 rounded-lg bg-[#1a202a] hover:bg-[#222a38] border border-[#2e3746] text-[#e7eaef] text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-[#c49b66]" />
                    Muestra Biomecánica
                  </button>
                </div>
              </div>
            )}

            {/* Hidden capture canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Processing Spinner Overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-20">
                <RefreshCw className="w-9 h-9 text-[#c49b66] animate-spin mb-3" />
                <h4 className="text-base font-semibold text-[#f3f4f6]">
                  Evaluando Alineación Corporal con IA...
                </h4>
                <p className="text-xs text-[#8b94a3] mt-1">
                  Midiendo ángulos cervicales, nivelación escapular y descompresión de canales.
                </p>
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#14181f] border border-[#252b36]">
            <div className="flex items-center gap-2">
              {cameraActive ? (
                <>
                  <button
                    onClick={captureFrameAndAnalyze}
                    disabled={isAnalyzing}
                    className="px-4 py-2 rounded-lg bg-[#c49b66] hover:bg-[#b08753] text-[#0d1014] text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5 shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    Capturar & Evaluar Postura
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-3 py-2 rounded-lg bg-[#1c222c] border border-[#2e3746] text-[#98a2b3] hover:text-[#f3f4f6] text-xs transition-colors"
                  >
                    Pausar Cámara
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={startCamera}
                    className="px-4 py-2 rounded-lg bg-[#1c222c] hover:bg-[#222a38] border border-[#2e3746] text-[#e7eaef] text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Camera className="w-4 h-4 text-[#c49b66]" />
                    Encender Cámara
                  </button>
                  <button
                    onClick={loadSampleSilhouette}
                    className="px-3 py-2 rounded-lg bg-[#1c222c] hover:bg-[#222a38] border border-[#2e3746] text-[#98a2b3] hover:text-[#f3f4f6] text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#c49b66]" />
                    Cargar Postura Modelo
                  </button>
                </>
              )}
            </div>

            {/* Custom Image Upload Button */}
            <label className="cursor-pointer px-3 py-2 rounded-lg bg-[#1c222c] hover:bg-[#222a38] border border-[#2e3746] text-[#98a2b3] hover:text-[#f3f4f6] text-xs font-medium transition-colors flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Right Column: AI Analysis Report & Real-time Cues (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {analysisResult ? (
            <div className="rounded-2xl bg-[#14181f] border border-[#252b36] p-5 space-y-5">
              
              {/* Score Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#252b36]">
                <div>
                  <div className="text-xs text-[#8b94a3] uppercase tracking-wider font-semibold">
                    Índice de Alineación
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-bold font-mono-num text-[#f3f4f6]">
                      {analysisResult.overallScore}
                    </span>
                    <span className="text-xs text-[#8b94a3]">/ 100</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      analysisResult.overallScore >= 80 ? 'bg-[#0e2e24] text-[#34d399]' : 'bg-[#3a2a08] text-[#fbbf24]'
                    }`}>
                      {analysisResult.postureGrade}
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-full border-2 border-[#c49b66] flex items-center justify-center font-serif-tcm font-bold text-lg text-[#c49b66]">
                  正
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-[#e7eaef] leading-relaxed">
                {analysisResult.summaryText}
              </p>

              {/* Real-time Verbal Correction Cues */}
              <div className="p-3.5 rounded-xl bg-[#1a202a] border border-[#2e3746]">
                <div className="text-xs font-semibold text-[#c49b66] mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Correcciones Inmediatas en Tiempo Real
                </div>
                <ul className="space-y-1.5">
                  {analysisResult.realtimeCorrectionCues?.map((cue, idx) => (
                    <li key={idx} className="text-xs text-[#e7eaef] flex items-start gap-2">
                      <span className="text-[#c49b66] font-bold">›</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deviations Identified */}
              <div>
                <div className="text-xs font-semibold text-[#f3f4f6] mb-2">
                  Desviaciones Biomecánicas Detectadas:
                </div>
                <div className="space-y-1.5">
                  {analysisResult.deviationsIdentified?.map((dev, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-1.5 rounded-lg bg-[#181d25] border border-[#252b36] text-xs text-[#98a2b3] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24] shrink-0" />
                      <span>{dev}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Injury Prevention Warning */}
              <div className="p-3 rounded-xl bg-[#0e2e24] border border-[#34d399]/30">
                <div className="text-xs font-semibold text-[#34d399] mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Prevención de Lesión a Largo Plazo
                </div>
                <p className="text-xs text-[#d8f3dc] leading-relaxed">
                  {analysisResult.injuryPreventionWarning}
                </p>
              </div>

              {/* TCM Jin Ye & Qi Insight */}
              <div className="p-3 rounded-xl bg-[#1a2647] border border-[#6f97ff]/30">
                <div className="text-xs font-semibold text-[#6f97ff] mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Beneficio Medicina Tradicional China (Jin Ye & Qi)
                </div>
                <p className="text-xs text-[#e0f5fa] leading-relaxed">
                  {analysisResult.tcmVitalityInsight}
                </p>
              </div>

            </div>
          ) : (
            <div className="rounded-2xl bg-[#14181f] border border-[#252b36] p-6 text-center flex flex-col items-center justify-center h-full min-h-[360px]">
              <div className="w-12 h-12 rounded-full bg-[#1c222c] border border-[#2e3746] flex items-center justify-center text-[#8b94a3] mb-3">
                <Sparkles className="w-6 h-6 text-[#c49b66]" />
              </div>
              <h3 className="text-sm font-semibold text-[#f3f4f6]">
                Panel de Diagnóstico Vacío
              </h3>
              <p className="text-xs text-[#8b94a3] mt-1 max-w-xs">
                Captura tu postura frente a la cámara o prueba con una foto para generar el informe biomecánico completo con IA.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
