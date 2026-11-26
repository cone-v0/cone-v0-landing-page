import ui from './ui.module.css'

type SectionNumberProps = {
  value: number
  className?: string
}

export function SectionNumber({ value, className }: SectionNumberProps) {
  return (
    <span className={[ui.sectionNumber, className].filter(Boolean).join(' ')} aria-hidden="true">
      {value}
    </span>
  )
}
