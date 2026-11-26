// Contenido de la landing. Todo el copy vive aquí para editarlo sin tocar componentes.
// Textos marcados con «PENDIENTE» no aparecen en la maqueta y deben validarse.

import casoCap from './assets/renders/caso-cap.webp'
import casoRing1 from './assets/renders/caso-ring1.webp'
import casoRing2 from './assets/renders/caso-ring2.webp'
import ctaTapaAnillo from './assets/renders/cta-tapa-anillo.webp'
import heroFront from './assets/renders/hero-front.webp'
import industriasTop from './assets/renders/industrias-top.webp'
import introTilted from './assets/renders/intro-tilted.webp'
import procesoExplosionado from './assets/renders/proceso-explosionado.webp'
import serviciosContenido from './assets/renders/servicios-contenido.webp'
import serviciosModelado from './assets/renders/servicios-modelado.webp'
import serviciosRender from './assets/renders/servicios-render.webp'

export type Render = {
  src: string
  /** Tamaño natural en px de diseño (1920) */
  width: number
  height: number
  alt: string
}

export const renders = {
  heroFront: { src: heroFront, width: 541, height: 414, alt: 'Render frontal de la tapa roscada naranja' },
  introTilted: { src: introTilted, width: 568, height: 576, alt: 'Render de la tapa roscada vista desde su interior' },
  casoCap: { src: casoCap, width: 512, height: 314, alt: 'Tapa roscada naranja, componente superior' },
  casoRing1: { src: casoRing1, width: 402, height: 83, alt: 'Sello interior de la tapa' },
  casoRing2: { src: casoRing2, width: 464, height: 94, alt: 'Anillo de seguridad de la tapa' },
  industriasTop: { src: industriasTop, width: 569, height: 569, alt: 'Vista superior de la tapa con marcado de lote' },
  serviciosModelado: { src: serviciosModelado, width: 536, height: 465, alt: 'Malla 3D de la tapa roscada' },
  serviciosRender: { src: serviciosRender, width: 485, height: 575, alt: 'Render fotorrealista de la tapa con sus anillos' },
  serviciosContenido: { src: serviciosContenido, width: 567, height: 568, alt: 'Render de la tapa para catálogo y web' },
  procesoExplosionado: { src: procesoExplosionado, width: 489, height: 886, alt: 'Vista explosionada de los tres componentes de la tapa' },
  ctaTapaAnillo: { src: ctaTapaAnillo, width: 727, height: 518, alt: 'Tapa roscada naranja junto a su anillo de seguridad' },
} satisfies Record<string, Render>

export const contact = {
  // PENDIENTE: confirmar correo y redes oficiales.
  email: 'contacto@cone.com.mx',
  office: 'Querétaro, MX',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Facebook', href: 'https://www.facebook.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
}

export const nav = [
  { label: 'Caso', href: '#caso' },
  { label: 'Industrias', href: '#industrias' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Cotizar', href: '#contacto' },
]

export const heroPills = [
  { label: 'Visualización', href: '#servicios' },
  { label: 'Animación', href: '#proceso' },
  { label: 'Catálogo', href: '#contacto' },
]

export const hero = {
  title: 'Tapa Roscada 3 en 1',
  meta: ['Visualización 3D', 'Inyección plástica', 'ABS'],
  views: [
    { id: 'iso', short: 'ISO', label: 'Isométrica' },
    { id: 'f', short: 'F', label: 'Frontal' },
    { id: 'l', short: 'L', label: 'Lateral' },
    { id: 's', short: 'S', label: 'Superior' },
  ],
  viewsCaption: 'ISO · FRONTAL · LATERAL · SUPERIOR',
  tagline: 'Visualización 3D para la industria de manufactura.',
  subline: 'Convertimos tus planos en visualizaciones, animaciones y catálogos que venden.',
  scrollHint: 'Desplácese hacia abajo',
  assistant: {
    title: 'Asistente CONE',
    subtitle: '¿Qué necesitas visualizar?',
    options: [
      { id: 'cotizar', title: 'Cotizar proyecto', detail: 'Plano o pieza física' },
      { id: 'animacion', title: 'Animación', detail: 'Vista explosionada' },
      { id: 'catalogo', title: 'Catálogo', detail: 'Fichas técnicas' },
      { id: 'ia', title: 'Optimización IA', detail: 'Escalado 4K · 8K' },
    ],
    prompt: 'Visualizar 40 piezas CNC para catálogo',
    send: 'Enviar',
  },
  cards: {
    insumo: { title: 'Insumo técnico', detail: 'Plano AutoCAD · DWG · DXF', badge: 'COTA VALIDADA' },
    resolucion: {
      title: 'Resolución de entrega',
      detail: 'Render final optimizado con IA',
      options: [
        { label: '8K', size: '7680 × 4320' },
        { label: '4K', size: '3840 × 2160' },
      ],
    },
    formato: {
      title: 'Formato de entrega',
      detail: 'Material comercial',
      options: [
        { id: 'catalogo', title: 'Catálogo digital', detail: 'PDF INTERACTIVO · WEB' },
        { id: 'ficha', title: 'Ficha técnica', detail: 'PNG · PDF · IMPRESIÓN' },
      ],
    },
  },
}

export const intro = {
  // Fragmentos alternados: atenuado / acento
  parts: [
    { text: 'Tu pieza ', muted: true },
    { text: 'lista para vender ', muted: false },
    { text: 'antes de ', muted: true },
    { text: 'fabricarse ', muted: false },
    { text: 'y sin ', muted: true },
    { text: 'sesión de fotos.', muted: false },
  ],
}

export const caso = {
  number: 3,
  title: 'Caso',
  label: 'RENDER, VISUALIZACIONES 3D, TECNOLOGÍA, NO FOTO',
  paragraphs: [
    'Lo que ves en esta página no es una fotografía: es una visualizacion 3D.',
    'Tapa roscada de tres componentes modelada en 3D desde la información técnica, con materiales PBR de plástico real e imagen fotorealista lista para catálogo, web y ficha técnica.',
  ],
  dialLabel: '[ VISUALIZACION 3D ]',
  stats: [
    { value: '3 piezas', label: '[ COMPONENTES MODELADOS ]' },
    { value: '8K', label: '[ RESOLUCIÓN FINAL ]' },
    { value: '0 fotos', label: '[ SESIÓN FOTOGRÁFICA ]' },
  ],
}

export type Industry = {
  id: string
  tab: string
  paragraphs: string[]
  specs: { label: string; value: string }[][]
  tags: string[]
  render: Render
}

const sharedSpecs = [
  [
    { label: 'INSUMO', value: 'Plano o pieza física' },
    { label: 'VALIDACIÓN', value: 'AutoCAD · Fusion 360' },
  ],
  [
    { label: 'MODELADO', value: 'Blender' },
    { label: 'MATERIALES', value: 'PBR · Substance 3D Painter' },
  ],
  [
    { label: 'RESOLUCIÓN', value: '4K · 8K' },
    { label: 'ENTREGABLE', value: 'Catálogo · Ficha · Web' },
  ],
]

const respetamosCotas = 'Partimos de tu plano o de la pieza física y respetamos cada cota. El diseño no se altera sin tu autorización.'

export const industrias = {
  number: 4,
  title: 'Industrias',
  items: [
    {
      id: 'cnc',
      tab: 'CNC y torno',
      paragraphs: [
        'Talleres de torno, maquila y CNC con cientos de piezas: representación consistente por SKU, con el mismo fondo, luz y ángulo.',
        respetamosCotas,
      ],
      specs: sharedSpecs,
      tags: ['PIEZAS DE TORNO', 'MAQUILA', 'CNC', 'CATÁLOGOS'],
      render: renders.industriasTop,
    },
    {
      // PENDIENTE: copy no incluido en la maqueta.
      id: 'metal',
      tab: 'Metal Mecánica',
      paragraphs: [
        'Componentes, ensambles y estructuras metálicas con acabados fieles al material: cada pieza lista para catálogo sin fabricar muestras.',
        respetamosCotas,
      ],
      specs: sharedSpecs,
      tags: ['ENSAMBLES', 'ESTRUCTURAS', 'ACABADOS', 'CATÁLOGOS'],
      render: renders.ctaTapaAnillo,
    },
    {
      // PENDIENTE: copy no incluido en la maqueta.
      id: 'inyeccion',
      tab: 'Inyección plástica',
      paragraphs: [
        'Piezas inyectadas en cualquier color o resina antes de producir el molde: valida variantes y vende desde el render.',
        respetamosCotas,
      ],
      specs: sharedSpecs,
      tags: ['MOLDES', 'VARIANTES DE COLOR', 'ABS · PP', 'CATÁLOGOS'],
      render: renders.introTilted,
    },
    {
      // PENDIENTE: copy no incluido en la maqueta.
      id: 'refacciones',
      tab: 'Refacciones',
      paragraphs: [
        'Catálogos de refacciones industriales con vistas técnicas y explosionadas para que tu cliente identifique cada número de parte.',
        respetamosCotas,
      ],
      specs: sharedSpecs,
      tags: ['REFACCIONES', 'VISTAS EXPLOSIONADAS', 'FICHAS', 'CATÁLOGOS'],
      render: renders.procesoExplosionado,
    },
  ] satisfies Industry[],
}

export const servicios = {
  number: 5,
  title: 'Servicios',
  // Los «\n» reproducen los cortes de línea de la maqueta (solo en escritorio)
  items: [
    {
      id: 'modelado',
      tab: 'Modelado',
      value: '1:1',
      text: 'Modelado 3D de piezas y ensambles desde tus\nplanos, con validación de cotas y fidelidad total a tu\nespecificación.',
      render: renders.serviciosModelado,
    },
    {
      id: 'visualizacion',
      tab: 'Visualización',
      value: '8K',
      text: 'Materiales PBR, iluminación técnica o comercial\ny optimización con IA hasta 8K, sin alterar la\ngeometría.',
      render: renders.serviciosRender,
    },
    {
      id: 'contenido',
      tab: 'Contenido',
      value: '1 modelo',
      text: 'De un solo modelo 3D salen fotos, animaciones,\nfichas técnicas, catálogos y contenido web.',
      render: renders.serviciosContenido,
    },
  ],
  footLeft: '[ SERVICIO ]',
  footRight: '[ RESULTADO ]',
}

export const proceso = {
  number: 6,
  title: 'Proceso',
  label: 'DEL PLANO AL CATÁLOGO',
  text: 'Cinco etapas, un solo flujo de trabajo: revisión técnica de planos, modelado 3D en software especializado, digitalización y aplicación de materiales, optimización para visualización hiperrealista y adaptación gráfica para aplicaciones comerciales en resolución 4K, 8K o cualquier formato que tu proyecto requiera.',
  steps: [
    'Revisión técnica de planos',
    'Modelado 3D en software especializado',
    'Digitalización y aplicación de materiales',
    'Optimización para visualización hiperrealista',
    'Adaptación gráfica para aplicaciones comerciales',
  ],
}

export const cierre = {
  corner: '[ CONE ]',
  note: '[ RENDER · NO FOTO ]',
}

export const footer = {
  question: '¿Tus piezas no se ven como deberían?',
  lead: 'Envíanos tu plano o fotos de la pieza y cotiza tu material visual.',
  cta: 'Cotizar mi proyecto',
  columns: [
    {
      title: 'Servicios',
      links: [
        { label: 'Modelado 3D', href: '#servicios' },
        { label: 'Render fotorealista', href: '#servicios' },
        { label: 'Animación de producto', href: '#proceso' },
        { label: 'Optimización con IA', href: '#servicios' },
        { label: 'Catálogos y fichas técnicas', href: '#servicios' },
      ],
    },
    {
      title: 'Industrias',
      links: [
        { label: 'Torno y CNC', href: '#industrias' },
        { label: 'Maquila', href: '#industrias' },
        { label: 'Metal mecánica', href: '#industrias' },
        { label: 'Inyección plástica', href: '#industrias' },
        { label: 'MDF', href: '#industrias' },
        { label: 'Refacciones industriales', href: '#industrias' },
      ],
    },
  ],
  legal: 'LAS IMÁGENES DE PRODUCTO DE ESTE SITIO SON VISUALIZACIONES 3D HECHOS POR CONE A PARTIR DE INFORMACIÓN TÉCNICA.',
  copyright: '© CONE 2026. TODOS LOS DERECHOS RESERVADOS',
  privacy: 'AVISO DE PRIVACIDAD',
}

export const stickyBar = {
  brand: 'CONE',
  tagline: 'Visualización 3D industrial',
  center: 'Renders y animación para manufactura',
  timezoneLabel: 'GMT-6',
  timeZone: 'America/Mexico_City',
}
