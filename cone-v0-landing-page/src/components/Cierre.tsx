import { cierre, renders } from '../content'
import s from './Cierre.module.css'

/** 08 · CTA de cierre: render a sangre con marcas de esquina. */
export function Cierre() {
  const { ctaTapaAnillo } = renders
  return (
    <section id="cta" className={s.cierre} aria-label="Render de producto">
      <p className={`${s.corner} ${s.tl}`} aria-hidden="true">
        {cierre.corner}
      </p>
      <p className={`${s.corner} ${s.tr}`} aria-hidden="true">
        {cierre.note}
      </p>
      <p className={`${s.corner} ${s.bl}`} aria-hidden="true">
        {cierre.corner}
      </p>
      <p className={`${s.corner} ${s.br}`} aria-hidden="true">
        {cierre.note}
      </p>
      <img
        className={s.image}
        src={ctaTapaAnillo.src}
        width={ctaTapaAnillo.width}
        height={ctaTapaAnillo.height}
        alt={ctaTapaAnillo.alt}
        loading="lazy"
        decoding="async"
        data-reveal
      />
    </section>
  )
}
