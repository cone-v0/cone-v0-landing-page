import { intro, renders } from '../content'
import s from './Intro.module.css'

export function Intro() {
  const { introTilted } = renders
  return (
    <section id="intro" className={s.intro} aria-label="Propuesta de valor">
      <div className={s.textCol}>
        <p className={s.statement} data-reveal>
          {intro.parts.map((part) => (
            <span key={part.text} className={part.muted ? s.muted : undefined}>
              {part.text}
            </span>
          ))}
        </p>
      </div>
      <div className={s.imageCol}>
        <img
          className={s.image}
          src={introTilted.src}
          width={introTilted.width}
          height={introTilted.height}
          alt={introTilted.alt}
          loading="lazy"
          decoding="async"
          data-reveal
        />
      </div>
    </section>
  )
}
