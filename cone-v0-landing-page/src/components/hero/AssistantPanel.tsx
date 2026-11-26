import { useId, useRef, useState, type FormEvent } from 'react'
import { BookOpen, Calculator, Film, Mic, Paperclip, Send, Sparkles, Sun, X } from 'lucide-react'
import { contact, hero } from '../../content'
import s from './AssistantPanel.module.css'

const OPTION_ICONS = {
  cotizar: Calculator,
  animacion: Film,
  catalogo: BookOpen,
  ia: Sparkles,
} as const

const SUGGESTIONS = [
  hero.assistant.prompt,
  'Animación explosionada de un ensamble de 5 piezas',
  'Fichas técnicas en 8K para 12 SKU',
  'Catálogo digital de refacciones industriales',
]

// Web Speech API (dictado). No está en lib.dom de TypeScript, así que se tipa lo mínimo.
type Recognition = {
  lang: string
  interimResults: boolean
  start: () => void
  stop: () => void
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}
type RecognitionCtor = new () => Recognition

const getRecognition = (): RecognitionCtor | undefined => {
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

/**
 * «Asistente CONE»: accesos rápidos + campo de mensaje.
 * El envío abre un correo prellenado (no hay backend en esta versión).
 */
export function AssistantPanel() {
  const [collapsed, setCollapsed] = useState(false)
  const [message, setMessage] = useState(hero.assistant.prompt)
  const [focused, setFocused] = useState(false)
  const [attachment, setAttachment] = useState<string | null>(null)
  const [listening, setListening] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<Recognition | null>(null)
  const optionsId = useId()

  const focusInput = () => inputRef.current?.focus()

  const toggleDictation = () => {
    const Ctor = getRecognition()
    if (!Ctor) {
      focusInput()
      return
    }
    if (listening) {
      recognitionRef.current?.stop()
      return
    }
    const recognition = new Ctor()
    recognition.lang = 'es-MX'
    recognition.interimResults = false
    recognition.onresult = (event) => setMessage(event.results[0][0].transcript)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    setListening(true)
    recognition.start()
  }

  const nextSuggestion = () => {
    const index = SUGGESTIONS.indexOf(message)
    setMessage(SUGGESTIONS[(index + 1) % SUGGESTIONS.length])
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    const body = [message.trim(), attachment ? `Archivo a compartir: ${attachment}` : '']
      .filter(Boolean)
      .join('\n\n')
    const href = `mailto:${contact.email}?subject=${encodeURIComponent('Cotización · CONE')}&body=${encodeURIComponent(body)}`
    window.location.href = href
  }

  return (
    <aside className={s.panel} aria-label={hero.assistant.title}>
      <div className={s.card} data-collapsed={collapsed}>
        <div className={s.head}>
          <h2 className={s.title}>{hero.assistant.title}</h2>
          <p className={s.subtitle}>{hero.assistant.subtitle}</p>
          <button
            type="button"
            className={s.close}
            aria-expanded={!collapsed}
            aria-controls={optionsId}
            aria-label={collapsed ? 'Mostrar opciones del asistente' : 'Ocultar opciones del asistente'}
            onClick={() => setCollapsed((value) => !value)}
          >
            <X aria-hidden="true" strokeWidth={1.8} />
          </button>
        </div>
        <ul id={optionsId} className={s.options} inert={collapsed}>
          {hero.assistant.options.map((option) => {
            const Icon = OPTION_ICONS[option.id as keyof typeof OPTION_ICONS]
            return (
              <li key={option.id}>
                <button
                  type="button"
                  className={s.option}
                  onClick={() => {
                    setMessage(`${option.title}: `)
                    requestAnimationFrame(focusInput)
                  }}
                >
                  <Icon className={s.optionIcon} aria-hidden="true" strokeWidth={2} />
                  <span className={s.optionTitle}>{option.title}</span>
                  <span className={s.optionDetail}>{option.detail}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <form className={s.composer} onSubmit={onSubmit}>
        <label className={s.field}>
          <span className="visually-hidden">Describe tu proyecto</span>
          <input
            ref={inputRef}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Describe tu proyecto"
            data-mirror={!focused && message.length > 0}
            autoComplete="off"
          />
          {!focused && message.length > 0 && (
            <span className={s.mirror} aria-hidden="true">
              {message}
              <i className={s.caret} />
            </span>
          )}
        </label>
        {attachment && <p className={s.attachment}>{attachment}</p>}
        <div className={s.actions}>
          <button
            type="button"
            className={s.tool}
            aria-label="Dictar mensaje"
            aria-pressed={listening}
            title="Dictar mensaje"
            onClick={toggleDictation}
          >
            <Mic aria-hidden="true" strokeWidth={2} />
          </button>
          <button
            type="button"
            className={s.tool}
            aria-label="Adjuntar plano"
            title="Adjuntar plano"
            onClick={() => fileRef.current?.click()}
          >
            <Paperclip aria-hidden="true" strokeWidth={2} />
          </button>
          <button type="button" className={s.tool} aria-label="Sugerir otra idea" title="Sugerir otra idea" onClick={nextSuggestion}>
            <Sun aria-hidden="true" strokeWidth={2} />
          </button>
          <input
            ref={fileRef}
            type="file"
            hidden
            accept=".dwg,.dxf,.pdf,.step,.stp,.iges,.igs,.stl,.png,.jpg,.jpeg"
            onChange={(event) => setAttachment(event.target.files?.[0]?.name ?? null)}
          />
          <button type="submit" className={s.send} disabled={!message.trim()}>
            {hero.assistant.send}
            <Send aria-hidden="true" strokeWidth={2} />
          </button>
        </div>
      </form>
    </aside>
  )
}
