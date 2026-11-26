import { useState } from 'react'
import { BookOpen, ChevronLeft, ChevronRight, FileText, Maximize2 } from 'lucide-react'
import { hero } from '../../content'
import { BlueprintDrawing } from './BlueprintDrawing'
import s from './DeliveryCards.module.css'

const FORMAT_ICONS = { catalogo: BookOpen, ficha: FileText } as const

type CardHeadProps = { title: string; detail: string; href: string }

function CardHead({ title, detail, href }: CardHeadProps) {
  return (
    <div className={s.head}>
      <h3 className={s.title}>{title}</h3>
      <p className={s.detail}>{detail}</p>
      <a className={s.expand} href={href} aria-label={`Ver más sobre ${title.toLowerCase()}`}>
        <Maximize2 aria-hidden="true" strokeWidth={2} />
      </a>
    </div>
  )
}

export function DeliveryCards() {
  const { insumo, resolucion, formato } = hero.cards
  const [res, setRes] = useState(0)
  const [format, setFormat] = useState<string>(formato.options[0].id)

  const cycle = (step: number) => setRes((value) => (value + step + resolucion.options.length) % resolucion.options.length)
  const current = resolucion.options[res]
  const other = resolucion.options[(res + 1) % resolucion.options.length]

  return (
    <div className={s.cards}>
      <article className={`${s.card} ${s.insumo}`}>
        <CardHead title={insumo.title} detail={insumo.detail} href="#proceso" />
        <BlueprintDrawing className={s.drawing} />
      </article>

      <article className={`${s.card} ${s.resolucion}`}>
        <CardHead title={resolucion.title} detail={resolucion.detail} href="#servicios" />
        <div className={s.resolution} role="group" aria-label="Resolución de entrega">
          <div className={s.resCurrent} aria-live="polite">
            <button type="button" className={s.chev} aria-label="Resolución anterior" onClick={() => cycle(-1)}>
              <ChevronLeft aria-hidden="true" strokeWidth={1.8} />
            </button>
            <p key={current.label} className={s.resValue}>
              <strong>{current.label}</strong>
              <span>{current.size}</span>
            </p>
            <button type="button" className={s.chev} aria-label="Resolución siguiente" onClick={() => cycle(1)}>
              <ChevronRight aria-hidden="true" strokeWidth={1.8} />
            </button>
          </div>
          <button type="button" key={other.label} className={s.resOther} onClick={() => cycle(1)} aria-label={`Elegir ${other.label}`}>
            <strong>{other.label}</strong>
            <span>{other.size}</span>
          </button>
        </div>
      </article>

      <article className={`${s.card} ${s.formato}`}>
        <CardHead title={formato.title} detail={formato.detail} href="#contacto" />
        <div className={s.formats} role="radiogroup" aria-label="Formato de entrega">
          {formato.options.map((option) => {
            const Icon = FORMAT_ICONS[option.id as keyof typeof FORMAT_ICONS]
            const checked = format === option.id
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={checked}
                className={s.format}
                onClick={() => setFormat(option.id)}
              >
                <Icon className={s.formatIcon} aria-hidden="true" strokeWidth={1.9} />
                <span className={s.formatTitle}>{option.title}</span>
                <span className={s.formatDetail}>{option.detail}</span>
                <span className={s.radio} aria-hidden="true" />
              </button>
            )
          })}
        </div>
      </article>
    </div>
  )
}
