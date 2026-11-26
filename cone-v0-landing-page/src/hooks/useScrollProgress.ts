import { useEffect, useState, type RefObject } from 'react'

/**
 * Progreso (0 → 1) de un elemento mientras recorre el viewport.
 * 0 cuando su borde superior toca `start` (fracción del alto del viewport)
 * y 1 cuando lo toca su borde inferior en `end`.
 */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, start = 0.85, end = 0.45) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0

    const measure = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const from = vh * start
      const to = vh * end - rect.height
      const value = (from - rect.top) / (from - to)
      setProgress(Math.min(1, Math.max(0, value)))
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, start, end])

  return progress
}
