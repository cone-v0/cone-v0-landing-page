import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { proceso, renders } from '../content'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { SectionNumber } from './SectionNumber'
import s from './Proceso.module.css'
import ui from './ui.module.css'

export function Proceso() {
  const textRef = useRef<HTMLParagraphElement>(null)
  const progress = useScrollProgress(textRef, 0.95, 0.35)
  const words = useMemo(() => proceso.text.split(' '), [])
  const [open, setOpen] = useState(false)
  const popoverId = useId()
  const hotspotRef = useRef<HTMLDivElement>(null)

  // Las palabras se oscurecen conforme el párrafo recorre la pantalla
  const lit = Math.round(progress * words.length)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!hotspotRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <section id="proceso" className={s.proceso} aria-labelledby="proceso-title">
      <SectionNumber value={proceso.number} className={s.number} />
      <h2 id="proceso-title" className={`${ui.displayTitle} ${s.title}`}>
        {proceso.title}
      </h2>

      <p className={`${ui.monoLabel} ${s.label}`}>{proceso.label}</p>

      <p ref={textRef} className={s.text}>
        <span className="visually-hidden">{proceso.text}</span>
        <span aria-hidden="true">
          {words.map((word, index) => (
            <span key={index} className={s.word} data-lit={index < lit}>
              {word}{' '}
            </span>
          ))}
        </span>
      </p>

      <img
        className={s.image}
        src={renders.procesoExplosionado.src}
        width={renders.procesoExplosionado.width}
        height={renders.procesoExplosionado.height}
        alt={renders.procesoExplosionado.alt}
        loading="lazy"
        decoding="async"
        data-reveal
      />

      <div ref={hotspotRef} className={s.hotspot} data-open={open}>
        <button
          type="button"
          className={s.plus}
          aria-expanded={open}
          aria-controls={popoverId}
          aria-label={open ? 'Ocultar las cinco etapas' : 'Ver las cinco etapas del proceso'}
          onClick={() => setOpen((value) => !value)}
        >
          <Plus aria-hidden="true" strokeWidth={2.2} />
        </button>
        <div id={popoverId} className={s.popover} role="region" aria-label="Etapas del proceso" inert={!open}>
          <p className={s.popoverTitle}>Cinco etapas</p>
          <ol>
            {proceso.steps.map((step, index) => (
              <li key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
