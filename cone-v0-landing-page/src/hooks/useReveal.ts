import { useEffect } from 'react'

/**
 * Activa el revelado suave de los elementos con [data-reveal].
 * Sin IntersectionObserver o con movimiento reducido no se oculta nada.
 */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-reveal', 'in')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    const observeAll = () => {
      document.querySelectorAll('[data-reveal]:not([data-reveal="in"])').forEach((el) => observer.observe(el))
    }

    observeAll()
    root.classList.add('reveal-ready')

    return () => {
      observer.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [])
}
