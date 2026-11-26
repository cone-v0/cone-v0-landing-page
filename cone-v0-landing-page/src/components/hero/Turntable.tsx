import { useEffect, useRef } from 'react'
import topFace from '../../assets/renders/hero-top.webp'

/**
 * Tapa del hero en WebGL: giro de tornamesa (360° sobre su eje) e inclinación
 * por scroll (hasta 25°, dejando ver la cara superior), a partir de un solo render.
 *
 * La tapa es un cuerpo de revolución: cada píxel de la imagen se ubica en el círculo
 * horizontal de la pieza al que pertenece (radio por altura + elipse de la cámara).
 * - Giro: se muestrea ese círculo desplazado un ángulo (dos muestras separadas un
 *   periodo de estría para que el bucle sea continuo).
 * - Inclinación: se vuelve a proyectar la pieza con la cámara más alta. La pared y el
 *   hombro salen del render frontal; la cara superior (que el render frontal casi no
 *   muestra) sale de `hero-top.webp`, desenrollada del render de Proceso.
 * Luz y sombra quedan fijas, como en una tornamesa real.
 *
 * Todas las medidas están en px de hero-front.webp (541 × 414); el interior de la tapa
 * debe ser opaco en la imagen.
 */
const SIZE = [541, 414] as const
const PAD = 80 // lienzo extra por arriba para la cara superior al inclinar
const YP = 165 // pivote de la inclinación: centro de la tapa
const CX = 255.66 // eje vertical
const S0 = 0.0741 // seno de la elevación de cámara del render
const C0 = Math.sqrt(1 - S0 * S0)
const YT = 17 // plano de la cara superior (fila de su centro)
const RT = 188 // radio de la cara superior
// En el render (con perspectiva) la cara superior se ve casi de canto: su contorno es
// una elipse muy plana. La cara parte de ahí y pasa al modelo al empezar a inclinar.
const YT_REST = 15.5
const S_TOP = 0.024
const YB = 300.5 // círculo inferior (base)
const SHADOW_FROM = 322 // filas de la sombra, que no se mueve
const PERIOD = (18.75 * Math.PI) / 180 // separación angular entre estrías

// Radio por fila del centro de cada círculo, medido sobre la parte opaca del render
// (labio, hombro, cuerpo cónico, base). El perfil del render se usa para tomar color;
// el suave, para proyectar al inclinar: sin escalones y sin decrecer (el redondeo de la
// base haría que la proyección no fuera monótona y el contorno saldría mellado).
const PROFILE_SOURCE = [
  [8, 184], [12, 186], [24, 192], [26, 202.5], [32, 208], [38, 213],
  [44, 229.5], [60, 232.3], [280, 251.1], [292, 251], [300, 247.5],
]
const PROFILE_SMOOTH = [
  [8, 184], [14, 187], [22, 191], [30, 204], [38, 215], [48, 229.5],
  [60, 232.3], [280, 251.1], [300, 251.1],
]
// Círculos cuyo color en el render es opaco en todo el giro (±LIM); fuera de ellos las
// muestras pueden caer en el halo del recorte o en la sombra
const SAFE_ROWS = [12, 293] as const

const SECONDS_PER_TURN = 15
/** Inclinación máxima al bajar con el scroll */
const TILT_DEGREES = 25
/** Scroll (px de diseño en escritorio) para llegar a la inclinación máxima */
const TILT_RANGE = 140
/** En móvil/tablet, fracción del alto del viewport */
const TILT_RANGE_MOBILE = 0.35
/** Inercia del scroll (más alto = responde más rápido) */
const TILT_SMOOTHING = 8

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

const num = (n: number) => (Number.isInteger(n) ? `${n}.0` : `${n}`)
const glslProfile = (name: string, profile: number[][]) => {
  const lines = [`float ${name}(float y) {`, `  if (y <= ${num(profile[0][0])}) return ${num(profile[0][1])};`]
  for (let i = 1; i < profile.length; i++) {
    const [y0, r0] = profile[i - 1]
    const [y1, r1] = profile[i]
    lines.push(`  if (y <= ${num(y1)}) return mix(${num(r0)}, ${num(r1)}, (y - ${num(y0)}) / ${num(y1 - y0)});`)
  }
  lines.push(`  return ${num(profile[profile.length - 1][1])};`, '}')
  return lines.join('\n')
}

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
uniform sampler2D uTop;
uniform vec4 uA; // giro (mod periodo), periodo, giro de la cara superior, mezcla de perfiles
uniform vec4 uB; // seno de la elevación, escala vertical, contorno analítico (0-1), franja virtual (1-0)
uniform vec3 uC; // cara superior: fila del centro, seno de su elevación, opacidad
varying vec2 vUv;

const vec2 SIZE = vec2(${num(SIZE[0])}, ${num(SIZE[1])});
const float PAD = ${num(PAD)};
const float CX = ${num(CX)};
const float S0 = ${num(S0)};
const float YT = ${num(YT)};
const float RT = ${num(RT)};
const float YB = ${num(YB)};
const float YP = ${num(YP)};
const float YMIN = -8.0;
const float YREAL = ${num(PROFILE_SOURCE[0][0])};
const float SMAX = 0.96; // fracción del radio hasta donde se toma color al girar
const float LIM = 1.287; // asin(SMAX)
const float YSAFE0 = ${num(SAFE_ROWS[0])};
const float YSAFE1 = ${num(SAFE_ROWS[1])};

${glslProfile('rSrc', PROFILE_SOURCE)}
${glslProfile('rSmooth', PROFILE_SMOOTH)}
float rOut(float y) { return mix(rSrc(y), rSmooth(y), uA.w); }

vec4 src(vec2 p) { return texture2D(uTex, p / SIZE); }

// ¿Opaco y a más de 3 px del contorno del render? (a: alfa ya leído en p)
// Con soft, la transición sigue el antialias del contorno en vez de un umbral duro.
float solid(float a, float soft) { return mix(step(0.99, a), smoothstep(0.75, 1.0, a), soft); }
float inside(vec2 p, float a, float soft) {
  return solid(a, soft)
    * solid(src(p + vec2(3.0, 0.0)).a, soft) * solid(src(p - vec2(3.0, 0.0)).a, soft)
    * solid(src(p + vec2(0.0, 3.0)).a, soft) * solid(src(p - vec2(0.0, 3.0)).a, soft);
}

// Punto del render en el ángulo a (ya limitado a ±LIM) del círculo yc
vec2 ringAt(float yc, float a) {
  float r = rSrc(yc);
  return vec2(CX + r * sin(a), yc + r * S0 * cos(a));
}
vec4 ring(float yc, float a) { return src(ringAt(yc, a)); }

// Igual, pero si la muestra cae en el halo o la sombra, usa el círculo confiable más cercano
vec3 opaqueRing(float yc, float a, vec4 t) {
  vec3 safe = ring(clamp(yc, YSAFE0, YSAFE1), a).rgb;
  return mix(safe, t.rgb, smoothstep(0.8, 0.97, t.a));
}

float projY(float yc, float dx) {
  float r = rOut(yc);
  float c = sqrt(clamp(1.0 - (dx / r) * (dx / r), 0.0, 1.0));
  return YP + (yc - YP) * uB.y + r * uB.x * c;
}

void main() {
  vec2 p = vec2(vUv.x * SIZE.x, vUv.y * (SIZE.y + PAD) - PAD);
  float dx = p.x - CX;
  vec4 col = vec4(0.0);

  // Sombra: fija bajo la tapa
  if (p.y > ${num(SHADOW_FROM)} && p.y < SIZE.y) {
    vec4 sh = src(p);
    col = vec4(sh.rgb * sh.a, sh.a);
  }

  // Pared lateral y hombro: círculo de la pieza que cae en este píxel (bisección)
  float lo = YMIN;
  float hi = YB + 2.0;
  for (int i = 0; i < 16; i++) {
    float mid = 0.5 * (lo + hi);
    if (projY(mid, dx) < p.y) lo = mid; else hi = mid;
  }
  float yc = 0.5 * (lo + hi);
  float resid = abs(projY(yc, dx) - p.y);
  float ro = rOut(yc);
  if (resid < 1.5 && abs(dx) < ro + 1.0) {
    float th = asin(clamp(dx / ro, -1.0, 1.0));
    vec2 h = ringAt(yc, th);
    vec4 here = src(h);

    // Giro: dos muestras separadas un periodo de estría, limitadas al interior (±LIM)
    float delta = uA.x;
    float period = uA.y;
    float w = delta / period;
    float a1 = th - delta;
    float a2 = a1 + period;
    float v1 = step(abs(a1), LIM) * (1.0 - w);
    float v2 = step(abs(a2), LIM) * w;
    float n = v1 + v2;
    float c1 = clamp(a1, -LIM, LIM);
    float c2 = clamp(a2, -LIM, LIM);
    vec2 q1 = ringAt(yc, c1);
    vec2 q2 = ringAt(yc, c2);
    vec4 t1 = src(q1);
    vec4 t2 = src(q2);

    // Sin inclinar: el render tal cual. Gira el interior (muestras a más de 3 px del
    // contorno); la franja del contorno y los costados conservan su propio color.
    float k1 = v1 * inside(q1, t1.a, 1.0);
    float k2 = v2 * inside(q2, t2.a, 1.0);
    float nk = k1 + k2;
    vec3 turned = nk > 0.001 ? (t1.rgb * k1 + t2.rgb * k2) / nk : here.rgb;
    // (el borde inferior redondeado es liso: ahí el giro se desvanece y no deja costura)
    float spin = inside(h, here.a, 1.0) * clamp((SMAX - abs(dx) / ro) / 0.06, 0.0, 1.0)
      * (1.0 - smoothstep(YB - 12.0, YB - 4.0, yc));
    vec3 cRest = mix(here.rgb, turned, spin);
    vec4 rest = vec4(cRest * here.a, here.a);

    // Inclinada: contorno analítico (lados y base) y color solo de zonas opacas del render
    vec3 o1 = opaqueRing(yc, c1, t1);
    vec3 o2 = opaqueRing(yc, c2, t2);
    vec3 cTilt = n > 0.001 ? (o1 * v1 + o2 * v2) / n : o1 * (1.0 - w) + o2 * w;
    float covA = clamp(ro - abs(dx) + 0.5, 0.0, 1.0)
      * clamp(projY(YB, dx) - p.y + 0.5, 0.0, 1.0)
      * clamp(1.5 - resid, 0.0, 1.0);
    // lo que en el modelo queda por encima de la cara no asoma por arriba de ella
    if (yc < YT && p.y < uC.x) {
      float v = (p.y - uC.x) / (RT * uC.y);
      covA *= clamp(RT * sqrt(max(1.0 - v * v, 0.0)) - abs(dx) + 0.5, 0.0, 1.0);
    }
    vec4 tilt = vec4(cTilt * covA, covA);

    // Mezcla en alfa premultiplicado: lo que el render tiene casi transparente no pesa.
    // Por encima del labio solo hay cara superior: esa franja solo reproduce el render
    // y se va cuando la cara ya la cubre.
    vec4 side = yc < YREAL ? rest * uB.w : mix(rest, tilt, uB.z);
    col = side + col * (1.0 - side.a);
  }

  // Cara superior (aparece al inclinar)
  if (uC.z > 0.0) {
    vec2 uv = vec2(dx / RT, (p.y - uC.x) / (RT * uC.y));
    float rho = length(uv);
    if (rho < 1.02) {
      float cr = cos(uA.z);
      float sr = sin(uA.z);
      vec2 ruv = vec2(uv.x * cr - uv.y * sr, uv.y * cr + uv.x * sr);
      // 0.965: se queda dentro de la cara (el borde de la textura trae fondo del render)
      vec4 face = texture2D(uTop, ruv * 0.4825 + 0.5);
      float a = clamp((1.0 - rho) / 0.01, 0.0, 1.0) * uC.z;
      col = vec4(face.rgb * a, a) + col * (1.0 - a);
    }
  }
  gl_FragColor = col;
}`

type TurntableProps = {
  src: string
  /** Solo se anima mientras la vista está activa */
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

function loadTexture(gl: WebGLRenderingContext, unit: number, url: string) {
  const texture = gl.createTexture()
  const image = new Image()
  image.src = url
  const ready = image.decode().then(() => {
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  })
  return { texture, ready }
}

export function Turntable({ src, active, className }: TurntableProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phaseRef = useRef(0)
  const tiltRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const figure = canvas?.parentElement
    if (!canvas || !figure || !active) return
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

    const uA = gl.getUniformLocation(program, 'uA')
    const uB = gl.getUniformLocation(program, 'uB')
    const uC = gl.getUniformLocation(program, 'uC')
    gl.uniform1i(gl.getUniformLocation(program, 'uTex'), 0)
    gl.uniform1i(gl.getUniformLocation(program, 'uTop'), 1)

    const front = loadTexture(gl, 0, src)
    const top = loadTexture(gl, 1, topFace)
    let ready = false

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

    // Progreso de inclinación según el scroll (0 arriba, 1 tras TILT_RANGE)
    const tiltTarget = () => {
      const width = document.documentElement.clientWidth
      const range =
        width >= 1100 ? (TILT_RANGE * Math.min(width, 2400)) / 1920 : TILT_RANGE_MOBILE * window.innerHeight
      return Math.min(1, Math.max(0, window.scrollY / Math.max(range, 1)))
    }
    if (tiltRef.current === null) tiltRef.current = tiltTarget()

    const draw = () => {
      if (!ready) return
      resize()
      const e = smoothstep(0, 1, tiltRef.current ?? 0)
      const lift = ((TILT_DEGREES * Math.PI) / 180) * e
      const elevation = Math.asin(S0) + lift
      const k = Math.cos(elevation) / C0
      // del render al modelo (perfiles y cara superior) al empezar a inclinar
      const model = smoothstep(0, 0.3, e)
      const faceElevation = Math.asin(S_TOP) + (Math.asin(S0) - Math.asin(S_TOP)) * model + lift
      const faceY = YP + (YT_REST + (YT - YT_REST) * model - YP) * k

      const phase = phaseRef.current
      gl.uniform4f(uA, phase % PERIOD, PERIOD, phase % (Math.PI * 2), model)
      gl.uniform4f(uB, Math.sin(elevation), k, smoothstep(0, 0.08, e), 1 - smoothstep(0.04, 0.2, e))
      gl.uniform3f(uC, faceY, Math.sin(faceElevation), smoothstep(0, 0.04, e))
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    Promise.all([front.ready, top.ready])
      .then(() => {
        ready = true
        draw()
        figure.dataset.gl = 'on' // el lienzo ya pinta la tapa completa: se oculta la imagen
      })
      .catch(() => {})

    // Bucle: solo corre con la tapa en pantalla
    const speed = (Math.PI * 2) / SECONDS_PER_TURN
    let frame = 0
    let last = 0
    let visible = false
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0
      last = now
      phaseRef.current += dt * speed
      const current = tiltRef.current ?? 0
      tiltRef.current = current + (tiltTarget() - current) * (1 - Math.exp(-dt * TILT_SMOOTHING))
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
      delete figure.dataset.gl
      gl.deleteTexture(front.texture)
      gl.deleteTexture(top.texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
    }
  }, [active, src])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
