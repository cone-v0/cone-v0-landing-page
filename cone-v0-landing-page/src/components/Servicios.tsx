import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { servicios } from '../content'
import { SectionNumber } from './SectionNumber'
import s from './Servicios.module.css'
import ui from './ui.module.css'

// Posición de cada render en la maqueta (px de diseño, relativos a la sección)
const PLACEMENT: Record<string, { left: number; top: number }> = {
  modelado: { left: 708, top: 476 },
  visualizacion: { left: 716, top: 364 },
  contenido: { left: 683, top: 364 },
}

export function Servicios() {
  const [active, setActive] = useState(0)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()
  const items = servicios.items
  const current = items[active]

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }
    if (event.key in keys) {
      event.preventDefault()
      const next = (active + keys[event.key] + items.length) % items.length
      setActive(next)
      tabsRef.current[next]?.focus()
    }
  }

  return (
    <section id="servicios" className={s.servicios} aria-labelledby="servicios-title">
      <SectionNumber value={servicios.number} className={s.number} />
      <h2 id="servicios-title" className={`${ui.displayTitle} ${s.title}`}>
        {servicios.title}
      </h2>

      <div className={s.tabs} role="tablist" aria-label="Servicios" aria-orientation="vertical" onKeyDown={onKeyDown}>
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => {
              tabsRef.current[index] = el
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${item.id}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel`}
            tabIndex={index === active ? 0 : -1}
            className={s.tab}
            onClick={() => setActive(index)}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className={s.stage} aria-hidden="true">
        {items.map((item, index) => {
          const place = PLACEMENT[item.id]
          return (
            <img
              key={item.id}
              className={s.image}
              src={item.render.src}
              width={item.render.width}
              height={item.render.height}
              alt=""
              loading="lazy"
              decoding="async"
              data-active={index === active}
              style={{ '--l': place.left, '--t': place.top, '--w': item.render.width } as CSSProperties}
            />
          )
        })}
      </div>

      <div
        key={current.id}
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className={s.result}
      >
        <p className={s.value}>{current.value}</p>
        <p className={s.text}>{current.text}</p>
        <span className="visually-hidden">{current.render.alt}</span>
      </div>

      <p className={s.footLeft} aria-hidden="true">
        {servicios.footLeft}
      </p>
      <p className={s.footRight} aria-hidden="true">
        {servicios.footRight}
      </p>
    </section>
  )
}
