import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { industrias } from '../content'
import { Dotted } from './Dotted'
import { SectionNumber } from './SectionNumber'
import s from './Industrias.module.css'
import ui from './ui.module.css'

export function Industrias() {
  const [active, setActive] = useState(0)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()
  const items = industrias.items
  const current = items[active]

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 }
    if (event.key in keys) {
      event.preventDefault()
      const next = (active + keys[event.key] + items.length) % items.length
      setActive(next)
      tabsRef.current[next]?.focus()
    }
  }

  return (
    <section id="industrias" className={s.industrias} aria-labelledby="industrias-title">
      <SectionNumber value={industrias.number} className={s.number} />
      <h2 id="industrias-title" className={`${ui.displayTitle} ${s.title}`}>
        {industrias.title}
      </h2>

      <div className={s.tabs} role="tablist" aria-label="Industrias" onKeyDown={onKeyDown}>
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

      <div
        key={current.id}
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.id}`}
        className={s.panel}
      >
        <div className={s.copy}>
          {current.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <dl className={s.specs}>
          {current.specs.map((row) => (
            <div key={row[0].label} className={s.specRow}>
              {row.map((cell) => (
                <div key={cell.label} className={s.specCell}>
                  <dt>{cell.label}</dt>
                  <dd>
                    <Dotted text={cell.value} sepClassName={s.sep} />
                  </dd>
                </div>
              ))}
            </div>
          ))}
        </dl>

        <img
          className={s.image}
          src={current.render.src}
          width={current.render.width}
          height={current.render.height}
          alt={current.render.alt}
          loading="lazy"
          decoding="async"
          data-id={current.id}
        />

        <ul className={s.tags} aria-label="Etiquetas">
          {current.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
