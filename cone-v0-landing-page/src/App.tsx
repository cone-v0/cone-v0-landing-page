import { Caso } from './components/Caso'
import { Cierre } from './components/Cierre'
import { Footer } from './components/Footer'
import { Hero } from './components/hero/Hero'
import { Industrias } from './components/Industrias'
import { Intro } from './components/Intro'
import { Proceso } from './components/Proceso'
import { Servicios } from './components/Servicios'
import { StickyBar } from './components/StickyBar'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()

  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <StickyBar />
      <main id="contenido">
        <Hero />
        <Intro />
        <Caso />
        <Industrias />
        <Servicios />
        <Proceso />
        <Cierre />
      </main>
      <Footer />
    </>
  )
}
