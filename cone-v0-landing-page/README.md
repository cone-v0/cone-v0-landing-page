# CONE · Landing page

Landing de CONE (visualización 3D para manufactura), construida a partir de la maqueta
`CONE_Maqueta_v02_DEV.psd` (1920 × 9676 px). React 19 + TypeScript + Vite, CSS Modules.

## Comandos

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # tipado + build de producción en dist/
npm run lint     # oxlint
```

## Cómo está construida

- **Escala de diseño.** En escritorio (≥ 1100 px) todas las medidas se escriben en px de la
  maqueta con `calc(N * var(--px))`, donde `--px` = ancho útil / 1920 (lo calcula un script
  en `index.html`). A 1920 px la página coincide con la maqueta; en otros anchos se escala
  en proporción. Por encima de 2400 px la escala se detiene y el lienzo se centra.
  Por debajo de 1100 px cada sección tiene un layout apilado propio.
- **Tipografías.**
  - Inter variable con eje de tamaño óptico (`@fontsource-variable/inter/opsz.css`). La
    maqueta usa los dos cortes: `--cut-display` (Inter Display) y `--cut-text` (Inter).
  - Kode Mono para las etiquetas técnicas.
  - Helvetica Neue Light (fuente del sistema) para los títulos gigantes y las cifras.
- **Contenido.** Todo el texto está en `src/content.ts`.
- **Renders.** `src/assets/renders/*.webp` se recortaron de la maqueta y tienen el fondo
  convertido a transparencia.
- **Tapa del hero (giro 360° + inclinación por scroll).** `src/components/hero/Turntable.tsx`
  dibuja la tapa de `hero-front.webp` con un shader WebGL. Como es un cuerpo de revolución,
  cada píxel se ubica en su círculo horizontal (perfil de radios por altura):
  - Giro: se muestrea ese círculo desplazado un ángulo; luz y sombra quedan fijas.
  - Inclinación: al bajar con el scroll la cámara sube hasta 25° (`TILT_DEGREES`) y se ve la
    cara superior, que sale de `hero-top.webp` (desenrollada del render de Proceso). Llega al
    máximo tras `TILT_RANGE` px de diseño en escritorio y `TILT_RANGE_MOBILE` del alto del
    viewport en móvil; `TILT_SMOOTHING` controla la inercia. Al subir se endereza.
  - Las medidas (eje, perfiles, cara superior) están en px de `hero-front.webp`; si cambia
    el encuadre del render hay que volver a medirlas. El interior de la tapa en la imagen
    debe ser opaco.
  - Sin WebGL o con «reducir movimiento» activado se muestra la imagen fija.

## Pendientes

- Sustituir los renders por las exportaciones originales a 2× (los actuales son 1×,
  extraídos del PDF de la maqueta).
- Sustituir el logotipo vectorizado (`src/components/logoPath.ts`) por el SVG oficial.
- Confirmar el correo de contacto y las URLs de redes (`contact` en `src/content.ts`).
- Validar el texto de las pestañas Metal Mecánica, Inyección plástica y Refacciones
  (marcado como «PENDIENTE»; no viene en la maqueta).
- Enlazar el aviso de privacidad.
