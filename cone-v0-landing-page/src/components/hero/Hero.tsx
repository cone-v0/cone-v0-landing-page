import { useState, type CSSProperties } from 'react'
import { Aperture, Box, Layers, MapPin } from 'lucide-react'
import { contact, hero, heroPills, renders, type Render } from '../../content'
import { Logo } from '../Logo'
import { AssistantPanel } from './AssistantPanel'
import { DeliveryCards } from './DeliveryCards'
import s from './Hero.module.css'

type ViewId = (typeof hero.views)[number]['id']
type Mode = 'render' | 'capas' | 'malla'

type Placement = {
  render: Render
  /** Posición y ancho en px de diseño (lienzo 1920) */
  left: number
  top: number
  width: number
  /** Sombra de contacto generada por CSS (la vista frontal ya la trae en el render) */
  shadow?: boolean
}

const VIEW_RENDERS: Record<ViewId, Placement> = {
  iso: { render: renders.introTilted, left: 783, top: 236, width: 392, shadow: true },
  f: { render: renders.heroFront, left: 721, top: 268, width: 541 },
  l: { render: renders.casoCap, left: 722, top: 290, width: 512, shadow: true },
  s: { render: renders.industriasTop, left: 780, top: 222, width: 396, shadow: true },
}

const MODE_RENDERS: Record<Exclude<Mode, 'render'>, Placement> = {
  capas: { render: renders.procesoExplosionado, left: 862, top: 196, width: 236 },
  malla: { render: renders.serviciosModelado, left: 712, top: 236, width: 536 },
}

const MODES: { id: Mode; label: string; Icon: typeof Box }[] = [
  { id: 'render', label: 'Render 3D', Icon: Box },
  { id: 'capas', label: 'Vista explosionada', Icon: Layers },
  { id: 'malla', label: 'Malla del modelo', Icon: Aperture },
]

const placementStyle = (p: Placement) =>
  ({
    '--l': p.left,
    '--t': p.top,
    '--w': p.width,
    '--ar': `${p.render.width} / ${p.render.height}`,
  }) as CSSProperties

export function Hero() {
  const [view, setView] = useState<ViewId>('f')
  const [mode, setMode] = useState<Mode>('render')

  const placements: { key: string; placement: Placement; active: boolean }[] = [
    ...hero.views.map((v) => ({ key: v.id, placement: VIEW_RENDERS[v.id], active: mode === 'render' && view === v.id })),
    { key: 'capas', placement: MODE_RENDERS.capas, active: mode === 'capas' },
    { key: 'malla', placement: MODE_RENDERS.malla, active: mode === 'malla' },
  ]

  return (
    <section id="inicio" className={s.hero} aria-labelledby="hero-title">
      <div className={s.stage} aria-hidden="true" />

      {/* Barra superior (01_HEADER_BARRA) */}
      <div className={s.topbar}>
        <a href="#inicio" className={s.logo} aria-label="CONE, inicio">
          <Logo />
        </a>
        <ul className={s.socials} aria-label="Redes sociales">
          {contact.socials.map((social) => (
            <li key={social.label}>
              <a href={social.href} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            </li>
          ))}
        </ul>
        <nav className={s.pills} aria-label="Servicios destacados">
          {heroPills.map((pill, index) => (
            <a key={pill.label} href={pill.href} className={s.pill} data-active={index === 0 || undefined}>
              {pill.label}
            </a>
          ))}
        </nav>
        <p className={s.office}>
          <MapPin className={s.officeIcon} aria-hidden="true" strokeWidth={2.1} />
          <span>
            <span className={s.officeLabel}>Oficina:</span> {contact.office}
          </span>
        </p>
      </div>

      {/* Ficha de producto */}
      <div className={s.info}>
        <h1 id="hero-title" className={s.title}>
          {hero.title}
        </h1>
        <p className={s.meta}>
          {hero.meta.map((item, index) => (
            <span key={item}>
              {index > 0 && <span className={s.metaDot}> · </span>}
              {item}
            </span>
          ))}
        </p>

        <div className={s.views} role="radiogroup" aria-label="Vista del modelo">
          {hero.views.map((v) => (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={mode === 'render' && view === v.id}
              aria-label={v.label}
              className={s.viewBtn}
              data-id={v.id}
              onClick={() => {
                setView(v.id)
                setMode('render')
              }}
            >
              {v.short}
            </button>
          ))}
        </div>
        <p className={s.viewsCaption} aria-hidden="true">
          {hero.viewsCaption}
        </p>

        <div className={s.modes} role="group" aria-label="Modo de visualización">
          {MODES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              className={s.modeBtn}
              aria-pressed={mode === id}
              aria-label={label}
              title={label}
              onClick={() => setMode(id)}
            >
              <Icon aria-hidden="true" strokeWidth={1.9} />
            </button>
          ))}
        </div>
      </div>

      {/* Render central */}
      <div className={s.product}>
        {placements.map(({ key, placement, active }) => (
          <figure key={key} className={s.render} data-active={active} style={placementStyle(placement)}>
            {placement.shadow && <span className={s.contactShadow} aria-hidden="true" />}
            <img
              src={placement.render.src}
              width={placement.render.width}
              height={placement.render.height}
              alt={active ? placement.render.alt : ''}
              loading={key === 'f' ? 'eager' : 'lazy'}
              fetchPriority={key === 'f' ? 'high' : 'auto'}
              decoding="async"
            />
          </figure>
        ))}
      </div>

      <AssistantPanel />
      <DeliveryCards />

      {/* Bajo el escenario */}
      <div className={s.below}>
        <p className={s.tagline}>
          {hero.tagline}
          <span>{hero.subline}</span>
        </p>
        <a href="#intro" className={s.scrollHint}>
          {hero.scrollHint}
          <svg className={s.scrollDots} viewBox="0 0 22 10" aria-hidden="true">
            <circle cx="2" cy="2" r="1.6" />
            <circle cx="7" cy="6" r="1.6" />
            <circle cx="12" cy="1.6" r="1.6" />
            <circle cx="20" cy="2" r="1.6" />
          </svg>
        </a>
      </div>
    </section>
  )
}
