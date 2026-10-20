import { ExerciseItem } from '../types';

export const EXERCISE_DATABASE: ExerciseItem[] = [
  // FASE 1: AGUA Y SAL (2 min)
  {
    id: 'agua-sal',
    name: 'Reposición de Líquidos Jin Ye & Sal Mineral',
    chineseName: '生津补液',
    pinyin: 'Shēng Jīn Bǔ Yè',
    phase: 'agua',
    phaseOrder: 1,
    durationSeconds: 120,
    targetMeridian: 'Estómago (Wei) e Intestino Grueso (Da Chang)',
    primaryBenefit: 'Restituye el déficit de 300-500 ml perdidos en el sueño nocturno y diluye el volumen plasmático.',
    keyPostureAlignment: [
      'Sentado con columna erguida pero sin tensión lumbar (isquiones firmes).',
      'Hombros relajados y barbilla neutra paralela al suelo.',
      'Beber a sorbos lentos y conscientes, nunca de pie ni con prisas.'
    ],
    commonMistake: 'Beber de pie de un solo trago frío o con agua helada que contrae la musculatura gástrica.',
    preventionDetail: 'Evita hipotensión ortostática al incorporarse y espasmos de la mucosa visceral.',
    stepInstructions: [
      'Prepara 400-500 ml de agua templada (35-38 °C) con una pizca de sal marina no refinada.',
      'Toma asiento con la pelvis neutra y respira hondo antes del primer sorbo.',
      'Permite que el líquido humedezca el paladar (activando la saliva Jin Ye) antes de deglutir.',
      'Completa el vaso en 2 minutos pausados.'
    ],
    repCount: '1 vaso (450 ml)'
  },

  // FASE 2: RESPIRACIÓN CONSCIENTE (5 min)
  {
    id: 'respiracion-365',
    name: 'Coherencia Cardíaca 365 (Frecuencia 5.5s)',
    chineseName: '调息养气',
    pinyin: 'Tiáo Xī Yǎng Qì',
    phase: 'respiracion',
    phaseOrder: 2,
    durationSeconds: 300,
    targetMeridian: 'Pulmón (Fei) y Vaso Concepción (Renmai)',
    primaryBenefit: 'Modula el pico matutino de cortisol y maximiza la variabilidad de la frecuencia cardíaca (VFC/HRV).',
    keyPostureAlignment: [
      'Sentado en el tercio delantero del asiento o cojín de meditación.',
      'Coronilla proyectada al cielo (Punto Baihui Du-20) como suspendida de un hilo de seda.',
      'Pared abdominal relajada para permitir el descenso diafragmático completo.',
      'Mentón suavemente recogido hacia la nuez para abrir la charnela occipital.'
    ],
    commonMistake: 'Respiración torácica alta encogiendo hombros hacia las orejas y aguantando el aire.',
    preventionDetail: 'Reduce la sobrecarga del músculo trapecio superior y el esternocleidomastoideo.',
    stepInstructions: [
      'Adopta la postura Wu Ji sentado con las palmas sobre las rodillas.',
      'Minuto 1: Asienta el ritmo natural y relaja la mandíbula y el entrecejo.',
      'Minutos 2 a 4: Inhala por la nariz en 5.5 segundos expandiendo el Dan Tian inferior; exhala por la nariz en 5.5 segundos.',
      'Minuto 5: Suelta el conteo y observa la serenidad mental antes de ponerte en pie.'
    ],
    repCount: '30 ciclos respiratorios'
  },

  // FASE 3: MOVILIDAD ARTICULAR Y COLUMNA (7 min)
  {
    id: 'circulos-cuello',
    name: 'Semicírculos Cervicales de la Grulla',
    chineseName: '鹤首通关',
    pinyin: 'Hè Shǒu Tōng Guān',
    phase: 'movilidad',
    phaseOrder: 3,
    durationSeconds: 60,
    targetMeridian: 'Vejiga (Taiyang) y Vesícula Biliar (Shaoyang)',
    primaryBenefit: 'Descomprime el plexo suboccipital y moviliza vértebras C1-C7 tras el sueño.',
    keyPostureAlignment: [
      'Pecho abierto y hombros descendidos hacia los bolsillos traseros.',
      'Semicírculo anterior: del hombro derecho al esternón y al hombro izquierdo.',
      'Prohibido rotar hacia atrás en hiperextensión cervical brusca.'
    ],
    commonMistake: 'Forzar círculos completos hacia atrás comprimiendo arterias vertebrales y causando mareos.',
    preventionDetail: 'Previene pinzamiento foraminal y síndrome de vértigo posicional paroxístico.',
    stepInstructions: [
      'Inhala con la cabeza en el centro.',
      'Exhala dejando caer suavemente la barbilla hacia el esternón.',
      'Desliza la barbilla en arco hacia el hombro izquierdo.',
      'Repite 5 veces de ida y vuelta con suavidad extrema.'
    ],
    repCount: '5 por sentido'
  },
  {
    id: 'rotaciones-hombro',
    name: 'Rotación Escapular y Apertura del Pecho',
    chineseName: '开胸旋肩',
    pinyin: 'Kāi Xiōng Xuán Jiān',
    phase: 'movilidad',
    phaseOrder: 3,
    durationSeconds: 60,
    targetMeridian: 'Pulmón (Fei) y Pericardio (Xin Bao)',
    primaryBenefit: 'Corrige la antepulsión de hombros y el síndrome de postura cruzada superior.',
    keyPostureAlignment: [
      'Punta de los omóplatos descendiendo suavemente hacia la columna dorsal.',
      'Sin arquear la zona lumbar (mantener pelvis en posición neutra).',
      'Movimiento circular amplio y sincrónico con la respiración.'
    ],
    commonMistake: 'Elevar los hombros hacia las orejas activando los trapecios en lugar del serrato anterior.',
    preventionDetail: 'Evita tendinopatía del manguito rotador y bursitis subacromial.',
    stepInstructions: [
      'Brazos a los costados con codos ligeramente flexionados.',
      'Inhala elevando suavemente hacia delante y arriba.',
      'Exhala juntando escápulas y bajando con amplitud.',
      'Completa 10 hacia atrás y 10 hacia adelante.'
    ],
    repCount: '10 por sentido'
  },
  {
    id: 'gato-camello',
    name: 'Ondulación Vertebral del Dragón (Gato-Camello segmentario)',
    chineseName: '龙行脊柱',
    pinyin: 'Lóng Xíng Jǐ Zhù',
    phase: 'movilidad',
    phaseOrder: 3,
    durationSeconds: 90,
    targetMeridian: 'Canal Gobernador (Dumai) y Vejiga (Taiyang)',
    primaryBenefit: 'Lubrica los discos intervertebrales y reactiva el líquido cefalorraquídeo.',
    keyPostureAlignment: [
      'Cuadrupedia: muñecas bajo hombros, rodillas bajo caderas.',
      'Articulación segmento por segmento: inicia en la pelvis, luego lumbares, dorsales y cervicales.',
      'No forzar la curvatura en bloque.'
    ],
    commonMistake: 'Mover la columna como una tabla rígida sin diferenciación segmentaria de vértebras.',
    preventionDetail: 'Previene microtraumas discales y lumbalgias mecánicas matutinas.',
    stepInstructions: [
      'Inhala: anteversión pélvica, extiende vértebra a vértebra, mirada al frente suave.',
      'Exhala: retroversión pélvica, empuja el suelo con las palmas y redondea la espalda alta.',
      'Mantén los codos sin hiperextender.'
    ],
    repCount: '8-10 ciclos lentos'
  },
  {
    id: 'rotacion-toracica',
    name: 'Apertura Torácica del Fénix en Cuadrupedia',
    chineseName: '凤凰展翅',
    pinyin: 'Fèng Huáng Zhǎn Chì',
    phase: 'movilidad',
    phaseOrder: 3,
    durationSeconds: 90,
    targetMeridian: 'Vesícula Biliar e Intestino Delgado',
    primaryBenefit: 'Desbloquea la rigidez de la columna dorsal que atrapa la respiración.',
    keyPostureAlignment: [
      'Una mano detrás de la cabeza, codo abierto hacia afuera.',
      'La cadera se mantiene cuadrada e inmóvil sobre las rodillas.',
      'La rotación ocurre exclusivamente desde la caja torácica hacia arriba.'
    ],
    commonMistake: 'Girar toda la pelvis hacia el lado perdiendo la disociación torácica.',
    preventionDetail: 'Protege las facetas lumbares de torsiones forzadas.',
    stepInstructions: [
      'Mano derecha en nuca; inhala abriendo el codo derecho hacia el techo.',
      'Sigue el codo con la mirada sin desplazar el peso de las caderas.',
      'Exhala bajando el codo hacia la muñeca contraria.',
      'Completa 6 repeticiones y cambia de lado.'
    ],
    repCount: '6 por lado'
  },
  {
    id: 'cadera-90-90',
    name: 'Descompresión Pélvica 90/90 en el Suelo',
    chineseName: '松胯运髋',
    pinyin: 'Sōng Kuà Yùn Kuān',
    phase: 'movilidad',
    phaseOrder: 3,
    durationSeconds: 90,
    targetMeridian: 'Vesícula Biliar (Kuà) e Hígado',
    primaryBenefit: 'Restaura la rotación interna y externa de las caderas tras horas de sedentarismo.',
    keyPostureAlignment: [
      'Ambas rodillas y caderas en ángulos de 90 grados en el suelo.',
      'Tronco largo y erguido, sin desplomarse sobre los lumbares.',
      'Transición suave entre ambos lados sin rebotes violentos.'
    ],
    commonMistake: 'Inclinar excesivamente la espalda hacia atrás y tensar los flexores de cadera.',
    preventionDetail: 'Previene el pinzamiento femoroacetabular y el síndrome del piriforme.',
    stepInstructions: [
      'Sentado en el suelo con piernas flexionadas a 90° frente a ti.',
      'Gira ambas rodillas suavemente hacia un lado manteniendo el pecho alto.',
      'Respira dos ciclos y pivota sobre los talones hacia el lado opuesto.'
    ],
    repCount: '8 por lado'
  },
  {
    id: 'sentadilla-wuji',
    name: 'Sentadilla Profunda de Descarga Wu Ji',
    chineseName: '无极桩坐',
    pinyin: 'Wú Jí Zhuāng Zuò',
    phase: 'movilidad',
    phaseOrder: 3,
    durationSeconds: 60,
    targetMeridian: 'Riñón (Yongquan K1) y Bazo (Sanyinjiao SP6)',
    primaryBenefit: 'Descarga total del eje sacroilíaco y descompresión de discos lumbares.',
    keyPostureAlignment: [
      'Pies al ancho de hombros con puntas ligeramente orientadas hacia afuera (15-20°).',
      'Talones completamente apoyados en el suelo (usar soporte si se elevan).',
      'Espalda relajada y codos empujando suavemente rodillas hacia afuera.'
    ],
    commonMistake: 'Despegar los talones del suelo cargando todo el peso sobre las rótulas.',
    preventionDetail: 'Evita sobrecarga patelofemoral y acortamiento del tendón de Aquiles.',
    stepInstructions: [
      'Desciende caderas hacia los talones en cuclillas relajadas.',
      'Junta las palmas en el pecho y respira hondo hacia el suelo pélvico.',
      'Sostén 45 segundos con respiración serena.'
    ],
    repCount: '45 segundos sostenidos'
  },

  // FASE 4: DRENAJE LINFÁTICO Y LÍQUIDOS JIN YE (5 min)
  {
    id: 'drenaje-linfatico',
    name: 'Secuencia Centrípeta de Drenaje Linfático y Daoyin',
    chineseName: '引液归心',
    pinyin: 'Yǐn Yè Guī Xīn',
    phase: 'drenaje',
    phaseOrder: 4,
    durationSeconds: 300,
    targetMeridian: 'Canal Linfático y Vaso Concepción (Conducto Torácico)',
    primaryBenefit: 'Activa la reabsorción de líquido intersticial retenido y acelera el retorno venoso.',
    keyPostureAlignment: [
      'Dirección ÚNICA y estricta: siempre de periferia hacia el centro (hacia el corazón y subclavias).',
      'Presión ultra ligera: equivalente al peso de una moneda sobre el párpado cerrado.',
      'No comprimir nunca los ganglios linfáticos inflamados; bordear suavemente.'
    ],
    commonMistake: 'Frotar o masajear hacia abajo (alejándose del corazón) o apretar con fuerza causando hematomas.',
    preventionDetail: 'Evita colapso de capilares linfáticos y reflujo en válvulas venosas.',
    stepInstructions: [
      'Bombeo 1 (Pies y tobillos, 60s): Fricción suave ascendente de empeine y gemelo hacia rodilla.',
      'Bombeo 2 (Ingles y muslos, 60s): Barrido desde la rodilla por cara interna hacia el pliegue inguinal.',
      'Bombeo 3 (Costados y axilas, 60s): Deslizamiento suave desde la parrilla costal hacia el hueco axilar.',
      'Bombeo 4 (Cuello y clavículas, 60s): Pases descendentes desde la base mandibular hacia el hueco supraclavicular (conducto torácico).'
    ],
    repCount: '5-6 pases lentos por estación'
  },

  // FASE 5: LUZ MATUTINA Y ANCLAJE CIRCADIANO (3 min)
  {
    id: 'luz-circadiana',
    name: 'Anclaje Circadiano Fotolumínico Matutino',
    chineseName: '采日光华',
    pinyin: 'Cǎi Rì Guāng Huá',
    phase: 'luz',
    phaseOrder: 5,
    durationSeconds: 180,
    targetMeridian: 'Ojos (Meridiano de Hígado e IpRGCs en Retina)',
    primaryBenefit: 'Activa células ganglionares intrínsecamente fotosensibles (ipRGCs) sincronizando el reloj maestro SCN.',
    keyPostureAlignment: [
      'Postura Wu Ji de pie junto a ventana abierta o en exterior despejado.',
      'Sin gafas de sol ni cristales polarizados intermedios.',
      'Mirada relajada dirigida al horizonte (nunca mirar directo al disco solar).',
      'Piel de cara y antebrazos expuesta a la luz ambiental.'
    ],
    commonMistake: 'Mirar una pantalla de móvil creyendo que sustituye la intensidad lumínica ambiental (300 lux vs 10.000 lux).',
    preventionDetail: 'Previene insomnio de conciliación por retraso de fase de melatonina y fatiga crónica.',
    stepInstructions: [
      'Abre la ventana o sal a un balcón/patio despejado.',
      'Párate con los pies paralelos, rodillas suaves y brazos colgando con naturalidad.',
      'Respira el aire fresco matutino y contempla la luz del amanecer durante 3 minutos continuos.',
      'Siente la activación de la temperatura central y la claridad mental.'
    ],
    repCount: '3 minutos mínimos (10 min ideal)'
  }
];

export const INITIAL_PROFILES = [
  {
    id: 'prof-elena',
    name: 'Elena · Cervical & Fascias',
    avatarSeed: 'elena-zen',
    targetFocus: 'cervical' as const,
    customGoals: ['Reducir tensión en trapecios', 'Corregir cabeza adelantada', 'Drenaje linfático facial'],
    postureBaselineScore: 74,
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-20T07:15:00Z'
  },
  {
    id: 'prof-carlos',
    name: 'Carlos · Lumbar & Vitalidad Qi',
    avatarSeed: 'carlos-zen',
    targetFocus: 'lumbar' as const,
    customGoals: ['Aliviar rigidez lumbar matutina', 'Flexibilidad en caderas 90/90', 'Respiración diafragmática'],
    postureBaselineScore: 68,
    createdAt: '2026-10-05T09:00:00Z',
    updatedAt: '2026-10-19T08:20:00Z'
  },
  {
    id: 'prof-maestro',
    name: 'Maestro Li · Práctica Integral',
    avatarSeed: 'master-li',
    targetFocus: 'vitalidad_liquidos' as const,
    customGoals: ['Armonía de fluidos Jin Ye', 'Coherencia cardíaca 365', 'Anclaje circadiano'],
    postureBaselineScore: 92,
    createdAt: '2026-09-15T06:00:00Z',
    updatedAt: '2026-10-20T06:45:00Z'
  }
];
