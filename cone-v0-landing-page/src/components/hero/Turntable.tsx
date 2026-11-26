import { useEffect, useRef } from 'react'

/**
 * Giro de tornamesa (360° sobre el eje vertical) a partir de un solo render.
 *
 * La tapa es un cuerpo de revolución con estrías periódicas: cada píxel se ubica
 * en el círculo horizontal de la pieza al que pertenece (radio por altura, con la
 * elipse que produce la cámara ligeramente elevada) y se muestrea ese mismo
 * círculo desplazado un ángulo. Así giran el labio superior, el cuerpo estriado y
 * la base, mientras la luz, la silueta y la sombra quedan fijas, como en una
 * tornamesa real. Se mezclan dos muestras separadas un periodo de estría para que
 * el bucle sea continuo. Todo ocurre en un shader sobre la misma imagen.
 *
 * Medidas en px de hero-front.webp (541 × 414 px); el interior de la tapa debe ser
 * opaco en la imagen.
 */
const GEOMETRY = {
  size: [541, 414],
  cx: 255.66, // eje vertical
  // Radio de la pieza según la fila del centro de cada círculo (labio, hombro,
  // cuerpo cónico y base). Máximo 12 puntos.
  profile: [
    [8, 184.5],
    [11, 184.5],
    [13, 190],
    [19, 190],
    [20, 207],
    [22, 209],
    [35, 210.5],
    [36, 232],
    [48, 234.2],
    [292, 253.1],
    [295, 253.5],
    [302, 249],
  ],
  elevation: 0.0741, // seno del ángulo de cámara (aplana los círculos en elipses)
  period: (18.75 * Math.PI) / 180, // separación angular entre estrías
  sMax: 0.975, // límite lateral: el borde de la silueta no se reproyecta
  inset: 3, // px junto al contorno que quedan fijos
}

const SECONDS_PER_TURN = 15

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2((aPos.x + 1.0) * 0.5, (1.0 - aPos.y) * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uTex;
uniform vec2 uProf[12];
uniform vec4 uA; // delta, period, cx, elevation
uniform vec4 uB; // ancho, alto, sMax, inset
varying vec2 vUv;

float radius(float y) {
  if (y <= uProf[0].x) return uProf[0].y;
  for (int k = 0; k < 11; k++) {
    if (y <= uProf[k + 1].x) {
      float t = (y - uProf[k].x) / max(uProf[k + 1].x - uProf[k].x, 0.001);
      return mix(uProf[k].y, uProf[k + 1].y, t);
    }
  }
  return uProf[11].y;
}

float solid(vec2 p) { return step(0.99, texture2D(uTex, p / uB.xy).a); }

// Dentro de la tapa y a más de «inset» px del contorno
float inside(vec2 p) {
  vec2 dx = vec2(uB.w, 0.0);
  vec2 dy = vec2(0.0, uB.w);
  return solid(p) * solid(p + dx) * solid(p - dx) * solid(p + dy) * solid(p - dy);
}

void main() {
  vec2 p = vUv * uB.xy;
  float m = inside(p);
  if (m < 0.5) { gl_FragColor = vec4(0.0); return; }

  float delta = uA.x;
  float period = uA.y;
  float cx = uA.z;
  float sa = uA.w;

  // Círculo al que pertenece el píxel: y = yc + sa·r(yc)·cos(θ)
  float yc = p.y;
  float r = radius(yc);
  float th = 0.0;
  for (int i = 0; i < 4; i++) {
    r = radius(yc);
    th = asin(clamp((p.x - cx) / r, -1.0, 1.0));
    yc = p.y - sa * r * cos(th);
  }
  m *= clamp((uB.z - abs((p.x - cx) / r)) / 0.06, 0.0, 1.0);
  if (m <= 0.0) { gl_FragColor = vec4(0.0); return; }

  float e = sa * r;
  float t1 = th - delta;
  float t2 = t1 + period;
  vec2 p1 = vec2(cx + r * sin(t1), yc + e * cos(t1));
  vec2 p2 = vec2(cx + r * sin(t2), yc + e * cos(t2));
  float lim = asin(uB.z);
  float w = delta / period;
  float w1 = step(abs(t1), lim) * inside(p1) * (1.0 - w);
  float w2 = step(abs(t2), lim) * inside(p2) * w;
  float n = w1 + w2;
  if (n < 0.001) { gl_FragColor = vec4(0.0); return; }
  vec3 col = (texture2D(uTex, p1 / uB.xy).rgb * w1 + texture2D(uTex, p2 / uB.xy).rgb * w2) / n;
  gl_FragColor = vec4(col * m, m);
}`

type TurntableProps = {
  src: string
  /** Solo gira mientras la vista está activa */
  active: boolean
  className?: string
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Turntable shader: ${log}`)
  }
  return shader
}

export function Turntable({ src, active, className }: TurntableProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phaseRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false })
    if (!gl) return

    let program: WebGLProgram
    try {
      program = gl.createProgram()!
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT))
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    } catch {
      return // sin WebGL utilizable: se queda la imagen estática
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    const g = GEOMETRY
    const uA = gl.getUniformLocation(program, 'uA')
    const uB = gl.getUniformLocation(program, 'uB')
    const uProf = gl.getUniformLocation(program, 'uProf')
    let scale = 1

    // Las medidas se escalan si el render se sustituye por una exportación a
    // mayor resolución con el mismo encuadre.
    const setGeometry = (naturalWidth: number, naturalHeight: number) => {
      scale = naturalWidth / g.size[0]
      gl.uniform2fv(uProf, new Float32Array(g.profile.flatMap(([y, r]) => [y * scale, r * scale])))
      gl.uniform4f(uB, naturalWidth, naturalHeight, g.sMax, g.inset * scale)
    }

    const texture = gl.createTexture()
    let ready = false
    const image = new Image()
    image.src = src
    image
      .decode()
      .then(() => {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        setGeometry(image.naturalWidth, image.naturalHeight)
        ready = true
        draw()
      })
      .catch(() => {})

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const draw = () => {
      if (!ready) return
      resize()
      gl.uniform4f(uA, phaseRef.current % g.period, g.period, g.cx * scale, g.elevation)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    // Bucle: solo corre con la tapa en pantalla
    const speed = (Math.PI * 2) / SECONDS_PER_TURN
    let frame = 0
    let last = 0
    let visible = false
    const tick = (now: number) => {
      if (last) phaseRef.current += Math.min((now - last) / 1000, 0.1) * speed
      last = now
      draw()
      frame = requestAnimationFrame(tick)
    }
    const start = () => {
      if (frame) return
      last = 0
      frame = requestAnimationFrame(tick)
    }
    const stop = () => {
      cancelAnimationFrame(frame)
      frame = 0
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    observer.observe(canvas)
    const resizeObserver = new ResizeObserver(() => {
      if (!visible) draw()
    })
    resizeObserver.observe(canvas)

    return () => {
      stop()
      observer.disconnect()
      resizeObserver.disconnect()
      gl.deleteTexture(texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
  }, [active, src])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
