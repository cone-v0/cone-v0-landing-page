import { Fragment } from 'react'

type DottedProps = {
  text: string
  /** Clase para el separador «·» (permite darle más aire que un espacio normal) */
  sepClassName?: string
}

/** Renderiza «A · B · C» con el separador estilizable. */
export function Dotted({ text, sepClassName }: DottedProps) {
  const parts = text.split(' · ')
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${part}-${index}`}>
          {index > 0 && <span className={sepClassName}> · </span>}
          {part}
        </Fragment>
      ))}
    </>
  )
}
