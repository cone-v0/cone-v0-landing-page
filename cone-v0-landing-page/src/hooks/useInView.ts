import { useEffect, useState, type RefObject } from 'react'

/** true mientras el elemento está (al menos parcialmente) en el viewport. */
export function useInView(ref: RefObject<HTMLElement | null>, rootMargin = '0px') {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
