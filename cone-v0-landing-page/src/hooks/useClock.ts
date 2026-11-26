import { useEffect, useState } from 'react'

function formatTime(timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return `${get('hour')}:${get('minute')} ${get('dayPeriod').toLowerCase()}`
}

/** Hora local de una zona horaria, p. ej. «10:24 am». Se actualiza cada 15 s. */
export function useClock(timeZone: string) {
  const [time, setTime] = useState(() => formatTime(timeZone))

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatTime(timeZone)), 15_000)
    return () => window.clearInterval(id)
  }, [timeZone])

  return time
}
