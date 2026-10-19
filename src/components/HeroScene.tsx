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
const vec2 PLATFORM = vec2(0.605, 0.705);

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

void main() {
  vec2 uv = vUv;
  float t = uTime;

  // Regions of the artwork.
  float strands = smoothstep(0.0, 0.08, uv.x) * (1.0 - smoothstep(0.43, 0.49, uv.x))
                * smoothstep(0.30, 0.42, uv.y) * (1.0 - smoothstep(0.84, 0.92, uv.y));
  float chart = smoothstep(0.71, 0.79, uv.x) * (1.0 - smoothstep(0.62, 0.72, uv.y));
  vec2 bd = (uv - BRAIN) / vec2(0.155, 0.235);
  float brain = 1.0 - smoothstep(0.7, 1.0, length(bd));

  // Lines drift gently in the direction of travel.
  float wave = sin(uv.x * 64.0 - t * 2.4 + noise(uv * vec2(5.0, 18.0)) * 6.0);
  uv.y += wave * 0.0011 * (strands + chart * 0.7);

  vec3 col = texture2D(uTex, uv).rgb;
  float L = lum(col);
  float lit = smoothstep(0.1, 0.55, L);

  // Streams: fine highlights running along the strands into the brain,
  // and up the chart away from it.
  float sIn = pow(noise(vec2(uv.x * 46.0 - t * 2.0, uv.y * 16.0)), 4.0);
  float sOut = pow(noise(vec2((uv.x - uv.y * 0.6) * 40.0 - t * 2.2, (uv.y + uv.x * 0.3) * 14.0)), 4.0);
  col += col * (sIn * strands + sOut * chart) * lit * 2.2;

  // Brain: nodes twinkle, the whole mind breathes.
  float tw = pow(noise(uv * vec2(95.0, 54.0) + vec2(t * 0.7, -t * 0.5)), 7.0) * 4.0;
  col += col * tw * brain * smoothstep(0.3, 0.75, L);
  col *= 1.0 + brain * (0.06 + 0.06 * sin(t * 1.5));

  // One energy pulse every 5.5s: red over the losing chart, violet through
  // the brain, green as it climbs out on the right.
  float cyc = fract(t / 5.5);
  float px = mix(-0.08, 1.12, cyc);
  float bx = uv.x + 0.05 * (noise(vec2(uv.y * 9.0, t * 0.4)) - 0.5);
  float band = exp(-pow((bx - px) / 0.045, 2.0));
  vec3 pc = mix(vec3(1.0, 0.25, 0.32), vec3(0.72, 0.42, 1.0), smoothstep(0.4, 0.55, px));
  pc = mix(pc, vec3(0.2, 1.0, 0.62), smoothstep(0.68, 0.78, px));
  float region = max(strands, max(brain * 0.8, chart));
  col += pc * band * lit * region * 1.5;
  float afterglow = smoothstep(0.72, 0.8, px) * (1.0 - smoothstep(0.95, 1.12, px));

  // Rising chart becomes green; it brightens as each pulse arrives.
  float cyanish = smoothstep(0.02, 0.18, col.b - col.r);
  vec3 green = hueShift(col, 0.58) * vec3(0.85, 1.08, 0.95);
  col = mix(col, green, chart * cyanish * 0.92);
  col += col * chart * afterglow * 0.35 * lit;

  // Platform: light runs around the rings, and a ripple spreads outward.
  vec2 pp = (uv - PLATFORM) * IMG;
  pp.y /= 0.19;
  float r = length(pp) / (0.31 * IMG.x);
  float ang = atan(pp.y, pp.x);
  float rings = smoothstep(0.06, 0.18, r) * (1.0 - smoothstep(0.95, 1.12, r)) * (1.0 - brain);
  float sw = pow(0.5 + 0.5 * cos(ang - t * 0.8), 14.0) * 1.6 + pow(0.5 + 0.5 * cos(ang + t * 0.55 + 2.0), 18.0);
  float rp = fract(t / 3.6);
  float ripple = exp(-pow((r - rp * 1.05) / 0.035, 2.0)) * (1.0 - rp);
  col += col * (sw + ripple * 1.4) * rings * lit;

  // Energy rising up the stem from the platform into the brain.
  float stem = (1.0 - smoothstep(0.0, 0.035, abs(uv.x - 0.605))) * smoothstep(0.47, 0.53, uv.y) * (1.0 - smoothstep(0.66, 0.71, uv.y));
  col += col * stem * pow(noise(vec2(uv.x * 70.0, uv.y * 26.0 + t * 3.5)), 3.0) * 3.0 * lit;

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
