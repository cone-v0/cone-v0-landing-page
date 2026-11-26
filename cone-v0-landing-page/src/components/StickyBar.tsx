import { useEffect, useId, useState } from 'react'
import { nav, stickyBar } from '../content'
import { useClock } from '../hooks/useClock'
import s from './StickyBar.module.css'

/**
 * Barra fija (estado 01B de la maqueta). Aparece al salir de la barra del hero
 * y despliega el menú de secciones con el botón «menú / cerrar».
 */
export function StickyBar() {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const time = useClock(stickyBar.timeZone)
  const menuId = useId()

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const px = window.innerWidth / 1920
      setVisible(window.scrollY > Math.max(110 * px, 60))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const shown = visible || open

  return (
    <header className={s.bar} data-visible={shown} data-open={open} aria-label="Navegación principal">
      <a className={s.brand} href="#inicio" onClick={() => setOpen(false)}>
        <span className={s.mark} aria-hidden="true" />
        <span className={s.brandName}>{stickyBar.brand}</span>
      </a>
      <span className={s.tagline}>
        <span className={s.bullet} aria-hidden="true" />
        {stickyBar.tagline}
      </span>
      <span className={s.center}>{stickyBar.center}</span>
      <span className={s.clock}>
        {stickyBar.timezoneLabel} · <time>{time}</time>
      </span>

      <button
        type="button"
        className={s.toggle}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'cerrar' : 'menú'}
      </button>

      <nav id={menuId} className={s.menu} aria-label="Secciones" inert={!open}>
        <ul>
          {nav.map((item, index) => (
            <li key={item.href} style={{ transitionDelay: open ? `${80 + index * 45}ms` : '0ms' }}>
              <a href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
