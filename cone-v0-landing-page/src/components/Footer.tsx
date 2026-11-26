import { contact, footer } from '../content'
import { Logo } from './Logo'
import s from './Footer.module.css'

export function Footer() {
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent('Cotización de material visual · CONE')}`
  return (
    <footer id="contacto" className={s.footer}>
      <p className={s.question}>{footer.question}</p>
      <a href="#inicio" className={s.logo} aria-label="CONE, volver al inicio">
        <Logo />
      </a>

      <p className={s.lead}>{footer.lead}</p>
      <a className={s.cta} href={mailto}>
        {footer.cta}
      </a>

      {footer.columns.map((column, index) => (
        <nav key={column.title} className={`${s.column} ${index === 0 ? s.colA : s.colB}`} aria-label={column.title}>
          <p className={s.columnTitle}>{column.title}</p>
          <ul>
            {column.links.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      ))}

      <div className={s.legal}>
        <p>{footer.legal}</p>
        <p>
          {footer.copyright} · {/* PENDIENTE: enlazar al aviso de privacidad */}
          <a href="#contacto">{footer.privacy}</a>
        </p>
      </div>
    </footer>
  )
}
