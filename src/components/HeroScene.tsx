import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// The XORA hero artwork, animated in place by a fragment shader. Nothing is
// drawn on top of the picture: the shader brightens, shifts and moves the
// image's own lines so the story reads from within it —
// red trades on the left → energy through the brain → a green rising chart.

const SRC = "/brand/xora-hero.webp";

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform float uTime;
varying vec2 vUv;

const vec2 IMG = vec2(1672.0, 941.0);
const vec2 BRAIN = vec2(0.598, 0.37);
const vec2 RING_C = vec2(0.6005, 0.7075); // platform centre (measured)
const float RING_R = 300.0;               // px, rotating zone radius
const float RING_K = 0.315;               // perspective squash of the rings

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
vec3 hueShift(vec3 c, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211, 0.587, -0.274, -0.523, 0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0, 0.956, -0.272, -1.106, 0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * c;
  float h = atan(yiq.z, yiq.y) + a;
  float ch = length(yiq.yz);
  return toRGB * vec3(yiq.x, ch * cos(h), ch * sin(h));
}
// Colour of the story at a given x: red → violet (brain) → emerald.
vec3 storyColor(float x) {
  vec3 c = mix(vec3(1.0, 0.24, 0.32), vec3(0.66, 0.4, 1.0), smoothstep(0.38, 0.52, x));
  return mix(c, vec3(0.16, 0.95, 0.62), smoothstep(0.66, 0.78, x));
}
// Comet: sharp leading edge, long soft tail behind it.
float comet(float d) {
  return d > 0.0 ? exp(-pow(d / 0.022, 2.0)) : exp(-pow(d / 0.12, 2.0)) * 0.7;
}

void main() {
  float t = uTime;
  vec2 uv = vUv;

  vec2 bd = (uv - BRAIN) / vec2(0.16, 0.24);
  float brain = 1.0 - smoothstep(0.75, 1.15, length(bd));
  float strands = smoothstep(0.0, 0.08, uv.x) * (1.0 - smoothstep(0.43, 0.5, uv.x))
                * smoothstep(0.3, 0.42, uv.y) * (1.0 - smoothstep(0.84, 0.92, uv.y));
  float chart = smoothstep(0.7, 0.78, uv.x) * (1.0 - smoothstep(0.62, 0.72, uv.y));

  // --- motion: displace the picture itself ---------------------------------
  // Brain breathes.
  uv = mix(uv, BRAIN + (uv - BRAIN) * (1.0 - 0.016 * sin(t * 1.25)), brain);
  // Strands ripple toward the brain like a current.
  float w1 = sin(uv.x * 34.0 - t * 3.0 + uv.y * 10.0);
  float w2 = sin(uv.x * 72.0 - t * 5.0 + noise(uv * vec2(4.0, 14.0)) * 5.0);
  float reach = smoothstep(0.05, 0.4, uv.x);
  uv.y += (w1 * 0.0034 + w2 * 0.0011) * strands * (0.4 + reach);
  uv.x += w1 * 0.0012 * strands;
  // Chart lines shimmer upward.
  uv.y += sin((uv.x + uv.y) * 58.0 - t * 4.0) * 0.0013 * chart;
  // Platform geometry, in the plane of the floor.
  vec2 pp = (uv - RING_C) * IMG;
  pp.y /= RING_K;
  float rr = length(pp) / RING_R;
  float zone = smoothstep(0.16, 0.28, rr) * (1.0 - smoothstep(1.1, 1.45, rr)) * (1.0 - brain);

  vec3 col = texture2D(uTex, uv).rgb;
  float L = lum(col);
  float lit = smoothstep(0.08, 0.5, L);

  // --- light ----------------------------------------------------------------
  // Losing candles flicker on the left.
  float redPx = smoothstep(0.04, 0.2, col.r - col.b) * (1.0 - smoothstep(0.36, 0.46, uv.x));
  col += col * redPx * pow(noise(vec2(uv.x * 52.0, t * 1.6)), 3.0) * 1.4;

  // Streams along the strands and up the chart.
  float sIn = pow(noise(vec2(uv.x * 42.0 - t * 2.6, uv.y * 15.0)), 4.0);
  float sOut = pow(noise(vec2((uv.x - uv.y * 0.6) * 38.0 - t * 2.8, (uv.y + uv.x * 0.3) * 13.0)), 4.0);
  col += col * (sIn * strands + sOut * chart) * lit * 3.0;

  // Brain fires: twinkling nodes plus sparks running across it.
  float tw = pow(noise(vec2(uv.x * 95.0, uv.y * 54.0) + vec2(t * 0.9, -t * 0.6)), 7.0) * 5.0;
  float fire = pow(noise(vec2(uv.x * 36.0 - t * 1.8, uv.y * 22.0 + t * 0.4)), 6.0) * 4.0;
  col += col * (tw + fire) * brain * smoothstep(0.25, 0.7, L);
  col *= 1.0 + brain * (0.08 + 0.08 * sin(t * 1.25));

  // Two comets per cycle travel the whole story, left → right.
  float wob = 0.05 * (noise(vec2(uv.y * 8.0, t * 0.5)) - 0.5);
  float energy = 0.0;
  float arrive = 0.0;
  for (int k = 0; k < 2; k++) {
    float px = mix(-0.15, 1.2, fract(t / 4.2 + float(k) * 0.5));
    energy += comet(px - (uv.x + wob));
    arrive += smoothstep(0.7, 0.8, px) * (1.0 - smoothstep(1.0, 1.2, px));
  }
  float region = max(strands, max(brain * 0.85, chart));
  col += storyColor(uv.x) * energy * lit * region * 1.7;

  // The rising chart is emerald, brighter as each comet lands.
  float cyanish = smoothstep(0.02, 0.18, col.b - col.r);
  vec3 green = hueShift(col, 0.58) * vec3(0.85, 1.08, 0.95);
  col = mix(col, green, chart * cyanish * 0.94);
  col += col * chart * arrive * 0.3 * lit;

  // Platform: each ring's own lines light up in arcs that orbit, neighbouring
  // rings turning opposite ways; a ripple spreads; energy climbs the stem.
  float ang = atan(pp.y, pp.x);
  float band = floor(rr * 7.0);
  float dir = mod(band, 2.0) * 2.0 - 1.0;
  float sp = dir * (0.55 + 0.18 * band);
  float phase = hash(vec2(band, 4.0)) * 6.283;
  float arcA = pow(0.5 + 0.5 * cos(ang - t * sp - phase), 10.0);
  float arcB = pow(0.5 + 0.5 * cos(ang - t * sp - phase + 3.1416), 18.0) * 0.6;
  float rp = fract(t / 2.8);
  float ripple = exp(-pow((rr - rp * 1.3) / 0.05, 2.0)) * (1.0 - rp);
  col += col * ((arcA + arcB) * 2.4 + ripple * 1.8) * zone * lit;
  float stem = (1.0 - smoothstep(0.0, 0.035, abs(vUv.x - 0.603))) * smoothstep(0.47, 0.53, vUv.y) * (1.0 - smoothstep(0.66, 0.71, vUv.y));
  col += col * stem * pow(noise(vec2(vUv.x * 70.0, vUv.y * 26.0 + t * 4.5)), 3.0) * 3.5 * lit;

  // Drifting bokeh: red motes carried into the brain, green motes lifted out.
  vec3 motes = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float sc = 13.0 + fi * 8.0;
    vec2 p = vec2(vUv.x * sc * 1.777, vUv.y * sc) + vec2(-t * (0.55 + fi * 0.35), t * 0.12 * (fi + 1.0));
    vec2 id = floor(p);
    vec2 f = fract(p) - 0.5;
    float h = hash(id + fi * 17.0);
    vec2 o = (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.6;
    float sz = 0.05 + 0.09 * hash(id + 1.3);
    float g = smoothstep(sz, sz * 0.15, length(f - o)) * step(0.74, h);
    g *= 0.55 + 0.45 * sin(t * 2.2 + h * 40.0);
    motes += storyColor(vUv.x) * g * (0.35 + fi * 0.2);
  }
  float moteZone = smoothstep(0.12, 0.3, vUv.x) * smoothstep(0.12, 0.3, vUv.y) * (1.0 - smoothstep(0.62, 0.8, vUv.y));
  col += motes * moteZone;

  gl_FragColor = vec4(col, 1.0);
}`;

function useLivingImage(canvas: React.RefObject<HTMLCanvasElement | null>, onReady: () => void) {
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const gl = el.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      return s;
    };
    let prog: WebGLProgram;
    try {
      prog = gl.createProgram()!;
      gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link");
    } catch (err) {
      console.warn("XORA hero shader unavailable, showing still image.", err);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(prog, "uTime");

    let raf = 0;
    let ready = false;
    let inView = true;
    let disposed = false;
    const t0 = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const r = el.getBoundingClientRect();
      el.width = Math.max(1, Math.round(r.width * dpr));
      el.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, el.width, el.height);
    };
    const render = (now: number) => {
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    const start = () => {
      cancelAnimationFrame(raf);
      if (ready && inView && !document.hidden) raf = requestAnimationFrame(render);
    };

    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (disposed) return;
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      ready = true;
      if (import.meta.env.DEV) {
        // Dev-only: render a given second and return the frame, for tuning.
        (window as unknown as Record<string, unknown>).__xoraFrame = (sec: number) => {
          gl.uniform1f(uTime, sec);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          return el.toDataURL("image/jpeg", 0.92);
        };
      }
      resize();
      render(performance.now());
      onReady();
      start();
    };
    img.src = SRC;

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) start();
      else cancelAnimationFrame(raf);
    });
    const ro = new ResizeObserver(resize);
    io.observe(el);
    ro.observe(el);
    document.addEventListener("visibilitychange", start);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", start);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, [canvas, onReady]);
}

export function HeroScene({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);
  const onReady = useRef(() => setLive(true)).current;
  useLivingImage(canvas, onReady);

  return (
    <div className={cn("scene", className)} aria-hidden>
      <div className="scene-inner">
        <img
          className="scene-layer scene-img"
          src={SRC}
          srcSet="/brand/xora-hero-sm.webp 900w, /brand/xora-hero.webp 1672w"
          sizes="(max-width: 900px) 200vw, 115vw"
          alt=""
          decoding="async"
          fetchPriority="high"
          draggable={false}
        />
        <canvas ref={canvas} className={cn("scene-layer scene-gl", live && "is-live")} />
      </div>
    </div>
  );
}
