import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { caso, renders } from '../content'
import { useInView } from '../hooks/useInView'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { SectionNumber } from './SectionNumber'
import s from './Caso.module.css'
import ui from './ui.module.css'

// Geometría del dial (coordenadas de la maqueta, relativas a la sección)
const CX = 959.5
const CY = 1577
const R = 439.5
const polar = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180
  return { x: CX - Math.cos(a) * r, y: CY - Math.sin(a) * r }
}
const MAJOR = [30, 90, 150]
const MINOR = [15, 45, 60, 75, 105, 120, 135, 165]
const triangle = (deg: number) => {
  const tip = polar(deg, R - 11)
  const a = polar(deg - 1.15, R)
  const b = polar(deg + 1.15, R)
  return `M${tip.x} ${tip.y}L${a.x} ${a.y}L${b.x} ${b.y}Z`
}

function Dial({ spin }: { spin: number }) {
  return (
    <svg className={s.dial} viewBox="480 1120 960 530" fill="none" aria-hidden="true">
      <path d={`M${CX - R} ${CY}A${R} ${R} 0 0 1 ${CX + R} ${CY}`} stroke="#d6d6d6" />
      <g style={{ transform: `rotate(${spin}deg)`, transformOrigin: `${CX}px ${CY}px` }} className={s.dialMarks}>
        {MAJOR.map((deg) => {
          const a = polar(deg, 385)
          const b = polar(deg, 401)
          return <line key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#707477" strokeWidth="1.4" />
        })}
        {MINOR.map((deg) => {
          const a = polar(deg, 391)
          const b = polar(deg, 398)
          return <line key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#b9bcbe" strokeWidth="1.1" />
        })}
        {MAJOR.map((deg) => (
          <path key={`t${deg}`} d={triangle(deg)} fill="#bfc1c3" />
        ))}
      </g>
      <circle cx="960" cy={CY} r="59.5" stroke="#d3d3d3" />
    </svg>
  )
}

const SPINNER_DOTS = [
  { x: 0, y: 0, r: 4 },
  { x: -1.3, y: -16.8, r: 3.6 },
  { x: 16.7, y: -0.8, r: 3.6 },
  { x: 13, y: 11.5, r: 3.6 },
  { x: 1, y: 17.2, r: 3.6 },
  { x: -11, y: 12.5, r: 3.6 },
  { x: -17.3, y: 1.2, r: 3.6 },
]

export function Caso() {
  const figureRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const progress = useScrollProgress(figureRef, 1, 0.7)
  const statsInView = useInView(statsRef)
  const [activeStat, setActiveStat] = useState(0)

  useEffect(() => {
    if (!statsInView) return
    const id = window.setInterval(() => setActiveStat((value) => (value + 1) % caso.stats.length), 2600)
    return () => window.clearInterval(id)
  }, [statsInView])

  // 0 = piezas ensambladas, 1 = vista explosionada de la maqueta
  const explode = 0.35 + 0.65 * progress
  const pieceStyle = (assembledOffset: number) =>
    ({ '--dy': (1 - explode) * assembledOffset }) as CSSProperties

  return (
    <section id="caso" className={s.caso} aria-labelledby="caso-title">
      <SectionNumber value={caso.number} className={s.number} />
      <h2 id="caso-title" className={`${ui.displayTitle} ${s.title}`}>
        {caso.title}
      </h2>

      <p className={`${ui.monoLabel} ${s.label}`}>{caso.label}</p>
      <div className={s.text} data-reveal>
        {caso.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div ref={figureRef} className={s.figure}>
        <Dial spin={(1 - progress) * -8} />
        <img
          className={`${s.piece} ${s.cap}`}
          src={renders.casoCap.src}
          width={renders.casoCap.width}
          height={renders.casoCap.height}
          alt="Vista explosionada: tapa roscada y sus dos anillos interiores"
          loading="lazy"
          decoding="async"
          style={pieceStyle(70)}
        />
        <img
          className={`${s.piece} ${s.ring1}`}
          src={renders.casoRing1.src}
          width={renders.casoRing1.width}
          height={renders.casoRing1.height}
          alt=""
          loading="lazy"
          decoding="async"
          style={pieceStyle(-40)}
        />
        <img
          className={`${s.piece} ${s.ring2}`}
          src={renders.casoRing2.src}
          width={renders.casoRing2.width}
          height={renders.casoRing2.height}
          alt=""
          loading="lazy"
          decoding="async"
          style={pieceStyle(-190)}
        />
        <p className={s.dialLabel}>{caso.dialLabel}</p>
        <svg className={s.spinner} viewBox="-24 -24 48 48" aria-hidden="true">
          {SPINNER_DOTS.map((dot) => (
            <circle key={`${dot.x}${dot.y}`} cx={dot.x} cy={dot.y} r={dot.r} />
          ))}
        </svg>
      </div>

      <div ref={statsRef} className={s.stats}>
        {caso.stats.map((stat, index) => (
          <div key={stat.label} className={s.stat} data-active={index === activeStat}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
