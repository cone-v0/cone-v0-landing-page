/** Dibujo técnico de la tarjeta «Insumo técnico» (lienzo 451 × 120 px de diseño). */

const GRID_STEP = 12
const verticals = Array.from({ length: 38 }, (_, i) => i * GRID_STEP + 0.5)
const horizontals = Array.from({ length: 11 }, (_, i) => i * GRID_STEP + 0.5)

const CX = 91.75
const CY = 57.5
const ticks = Array.from({ length: 30 }, (_, i) => {
  const a = (i / 30) * Math.PI * 2
  const r1 = 38.5
  const r2 = 44
  return {
    x1: CX + Math.cos(a) * r1,
    y1: CY + Math.sin(a) * r1,
    x2: CX + Math.cos(a) * r2,
    y2: CY + Math.sin(a) * r2,
  }
})

const ribs = Array.from({ length: 10 }, (_, i) => 212.5 + i * 12)

export function BlueprintDrawing({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 451 120" fill="none" aria-hidden="true">
      <g stroke="#e2e4e5" strokeWidth="1">
        {verticals.map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="120" />
        ))}
        {horizontals.map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="445" y2={y} />
        ))}
      </g>

      {/* Pieza en planta */}
      <g stroke="#5d6367" strokeWidth="1.3">
        <path d={`M${CX - 55} ${CY}H${CX + 55}M${CX} 4V108`} stroke="#8f9497" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx={CX} cy={CY} r="44" />
        <circle cx={CX} cy={CY} r="35" />
        <circle cx={CX} cy={CY} r="2.6" />
        {ticks.map((t, i) => (
          <line key={i} {...t} strokeWidth="1.1" />
        ))}
      </g>

      {/* Cota validada */}
      <g filter="url(#bp-shadow)">
        <circle cx="137" cy="23.5" r="16" fill="#ef8640" />
      </g>
      <path d="M130.5 23.8l4.4 4.2 8.6-8.6" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      <text
        x="162"
        y="27.5"
        fill="#4a5054"
        fontFamily="'Kode Mono', ui-monospace, monospace"
        fontSize="9.6"
        letterSpacing="1.6"
      >
        COTA VALIDADA
      </text>

      {/* Pieza en alzado con estrías */}
      <g stroke="#5d6367" strokeWidth="1.3">
        <path d="M199.5 86V41a7.5 7.5 0 0 1 7.5-7.5h118a7.5 7.5 0 0 1 7.5 7.5V86Z" />
        {ribs.map((x) => (
          <line key={x} x1={x} y1="38" x2={x} y2="86" />
        ))}
      </g>

      {/* Cotas */}
      <g stroke="#5d6367" strokeWidth="1.2" fill="#5d6367">
        <line x1="347.5" y1="38" x2="347.5" y2="81" />
        <path d="M347.5 33.5l-3.6 6h7.2Z M347.5 85.5l-3.6 -6h7.2Z" stroke="none" />
        <line x1="204" y1="100" x2="328" y2="100" />
        <path d="M199.5 100l6 -3.6v7.2Z M332.5 100l-6 -3.6v7.2Z" stroke="none" />
      </g>

      <defs>
        <filter id="bp-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#ef8640" floodOpacity="0.3" />
        </filter>
      </defs>
    </svg>
  )
}
