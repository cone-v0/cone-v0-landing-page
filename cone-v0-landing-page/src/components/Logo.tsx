import { LOGO_PATH, LOGO_VIEWBOX } from './logoPath'

type LogoProps = {
  className?: string
  title?: string
}

/** Logotipo CONE · by The Icecream Studio. Hereda el color de `color`. */
export function Logo({ className, title = 'CONE by The Icecream Studio' }: LogoProps) {
  return (
    <svg className={className} viewBox={LOGO_VIEWBOX} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" fillRule="evenodd" d={LOGO_PATH} />
    </svg>
  )
}
