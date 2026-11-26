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
- **Giro 360° del hero.** `src/components/hero/Turntable.tsx` hace girar la tapa completa
  de `hero-front.webp` (labio, cuerpo estriado y base) sobre su eje vertical con un shader
  WebGL: como es un cuerpo de revolución, cada píxel se ubica en su círculo horizontal
  (perfil de radios por altura) y se muestrea ese círculo desplazado un ángulo; luz,
  contorno y sombra quedan fijos. El interior de la tapa en la imagen debe ser opaco. Si
  cambia el encuadre del render, hay que volver a medir `GEOMETRY` (una exportación a mayor
  resolución con el mismo encuadre se ajusta sola). Sin WebGL o con «reducir movimiento»
  activado se muestra la imagen fija.

## Pendientes

- Sustituir los renders por las exportaciones originales a 2× (los actuales son 1×,
  extraídos del PDF de la maqueta).
- Sustituir el logotipo vectorizado (`src/components/logoPath.ts`) por el SVG oficial.
- Confirmar el correo de contacto y las URLs de redes (`contact` en `src/content.ts`).
- Validar el texto de las pestañas Metal Mecánica, Inyección plástica y Refacciones
  (marcado como «PENDIENTE»; no viene en la maqueta).
- Enlazar el aviso de privacidad.
