import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export type DitherPatternType = 'wave' | 'radial' | 'aurora' | 'diagonal' | 'ripple';

interface DitherFieldProps {
  pattern?: DitherPatternType;
  cellSize?: number;
  dotRatio?: number;
  speed?: number;
  intensity?: number;
  lightColor?: string;
  darkColor?: string;
  className?: string;
}

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_cellSize;
uniform float u_dotRatio;
uniform float u_intensity;
uniform vec3 u_color;
uniform int u_pattern;

// 4x4 Bayer ordered dithering threshold (normalized 0..1)
float bayer4x4(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  int idx = y * 4 + x;
  if (idx == 0) return 0.0 / 16.0;
  if (idx == 1) return 8.0 / 16.0;
  if (idx == 2) return 2.0 / 16.0;
  if (idx == 3) return 10.0 / 16.0;
  if (idx == 4) return 12.0 / 16.0;
  if (idx == 5) return 4.0 / 16.0;
  if (idx == 6) return 14.0 / 16.0;
  if (idx == 7) return 6.0 / 16.0;
  if (idx == 8) return 3.0 / 16.0;
  if (idx == 9) return 11.0 / 16.0;
  if (idx == 10) return 1.0 / 16.0;
  if (idx == 11) return 9.0 / 16.0;
  if (idx == 12) return 15.0 / 16.0;
  if (idx == 13) return 7.0 / 16.0;
  if (idx == 14) return 13.0 / 16.0;
  return 5.0 / 16.0;
}

float fieldValue(vec2 uv, float t, int pattern) {
  if (pattern == 1) {
    // Radial pulse
    float d = length(uv - vec2(0.68, 0.45));
    return 0.5 + 0.5 * sin(d * 10.0 - t * 1.4);
  }
  if (pattern == 2) {
    // Aurora flow
    float w1 = sin(uv.x * 4.5 + t * 0.7 + cos(uv.y * 3.0 - t * 0.4));
    float w2 = cos(uv.y * 5.0 - t * 0.6 + sin(uv.x * 2.5 + t * 0.3));
    return 0.5 + 0.25 * (w1 + w2);
  }
  if (pattern == 3) {
    // Diagonal sweep
    return 0.5 + 0.5 * sin((uv.x + uv.y) * 6.0 - t * 1.1);
  }
  if (pattern == 4) {
    // Interference ripple
    float d1 = length(uv - vec2(0.25, 0.35));
    float d2 = length(uv - vec2(0.75, 0.65));
    return 0.5 + 0.25 * (sin(d1 * 12.0 - t) + sin(d2 * 12.0 - t * 1.2));
  }
  // Default (0): Layered Academy wave field
  float n1 = sin(uv.x * 4.2 + t * 0.65) * cos(uv.y * 3.4 - t * 0.45);
  float n2 = sin((uv.x * 2.4 - uv.y * 3.1) + t * 0.5);
  return clamp(0.48 + 0.32 * n1 + 0.24 * n2, 0.0, 1.0);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 cell = floor(frag / u_cellSize);
  vec2 cellLocal = fract(frag / u_cellSize);

  // Render crisp square dots inside each cell
  float margin = (1.0 - u_dotRatio) * 0.5;
  if (
    cellLocal.x < margin ||
    cellLocal.x > 1.0 - margin ||
    cellLocal.y < margin ||
    cellLocal.y > 1.0 - margin
  ) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec2 uv = (cell * u_cellSize) / max(u_resolution, vec2(1.0));
  float lum = fieldValue(uv, u_time, u_pattern) * u_intensity;
  float threshold = bayer4x4(cell);
  float active = step(threshold, lum);

  // Soft spatial weighting so dots look refined
  float alpha = active * (0.28 + 0.48 * lum);
  gl_FragColor = vec4(u_color, alpha);
}
`;

const PATTERN_INDEX: Record<DitherPatternType, number> = {
  wave: 0,
  radial: 1,
  aurora: 2,
  diagonal: 3,
  ripple: 4,
};

const BAYER_4X4 = [
  0 / 16, 8 / 16, 2 / 16, 10 / 16,
  12 / 16, 4 / 16, 14 / 16, 6 / 16,
  3 / 16, 11 / 16, 1 / 16, 9 / 16,
  15 / 16, 7 / 16, 13 / 16, 5 / 16,
];

function hexToRgbTuple(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const num = Number.parseInt(clean.length === 3 ? clean.replace(/(.)/g, '$1$1') : clean, 16);
  if (Number.isNaN(num)) return [0 / 255, 112 / 255, 243 / 255];
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

/**
 * Animated Bayer-dithered square dot field powered by WebGL
 * with a lightweight Canvas 2D fallback, theme color sync, and prefers-reduced-motion support.
 */
export const DitherField: React.FC<DitherFieldProps> = ({
  pattern = 'wave',
  cellSize = 6,
  dotRatio = 0.62,
  speed = 0.5,
  intensity,
  lightColor = '#0070F3',
  darkColor = '#3291FF',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const colorHex = isDark ? darkColor : lightColor;
    const rgb = hexToRgbTuple(colorHex);
    const effectiveIntensity = intensity ?? (isDark ? 0.62 : 0.44);
    const patternIndex = PATTERN_INDEX[pattern];

    let rafId = 0;
    let isVisible = true;
    let disposed = false;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      return dpr;
    };

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false });

    if (gl) {
      const compile = (type: number, source: string) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fs = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      const program = vs && fs ? gl.createProgram() : null;

      if (program && vs && fs) {
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
          const buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
            gl.STATIC_DRAW,
          );

          const posLoc = gl.getAttribLocation(program, 'a_position');
          const resLoc = gl.getUniformLocation(program, 'u_resolution');
          const timeLoc = gl.getUniformLocation(program, 'u_time');
          const cellLoc = gl.getUniformLocation(program, 'u_cellSize');
          const ratioLoc = gl.getUniformLocation(program, 'u_dotRatio');
          const intensityLoc = gl.getUniformLocation(program, 'u_intensity');
          const colorLoc = gl.getUniformLocation(program, 'u_color');
          const patternLoc = gl.getUniformLocation(program, 'u_pattern');

          const start = performance.now();

          const drawGl = (now: number) => {
            if (disposed) return;
            const dpr = resizeCanvas();
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            gl.useProgram(program);
            gl.enableVertexAttribArray(posLoc);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            const elapsed = prefersReducedMotion ? 1.5 : ((now - start) / 1000) * speed;
            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.uniform1f(timeLoc, elapsed);
            gl.uniform1f(cellLoc, Math.max(3, cellSize * dpr));
            gl.uniform1f(ratioLoc, dotRatio);
            gl.uniform1f(intensityLoc, effectiveIntensity);
            gl.uniform3f(colorLoc, rgb[0], rgb[1], rgb[2]);
            gl.uniform1i(patternLoc, patternIndex);

            gl.drawArrays(gl.TRIANGLES, 0, 6);

            if (!prefersReducedMotion && isVisible && document.visibilityState === 'visible') {
              rafId = requestAnimationFrame(drawGl);
            }
          };

          const ro = new ResizeObserver(() => drawGl(performance.now()));
          ro.observe(canvas);

          const io = new IntersectionObserver((entries) => {
            isVisible = Boolean(entries[0]?.isIntersecting);
            if (isVisible && !prefersReducedMotion) {
              cancelAnimationFrame(rafId);
              rafId = requestAnimationFrame(drawGl);
            }
          });
          io.observe(canvas);

          const onVis = () => {
            if (document.visibilityState === 'visible' && isVisible && !prefersReducedMotion) {
              cancelAnimationFrame(rafId);
              rafId = requestAnimationFrame(drawGl);
            }
          };
          document.addEventListener('visibilitychange', onVis);

          drawGl(start);

          return () => {
            disposed = true;
            cancelAnimationFrame(rafId);
            ro.disconnect();
            io.disconnect();
            document.removeEventListener('visibilitychange', onVis);
            gl.deleteBuffer(buffer);
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
          };
        }
      }
    }

    // Fallback: 2D Canvas Bayer-dithered square dots
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const start = performance.now();
    const draw2d = (now: number) => {
      if (disposed) return;
      const dpr = resizeCanvas();
      const step = Math.max(4, Math.round(cellSize * dpr));
      const dot = Math.max(2, Math.round(step * dotRatio));
      const offset = Math.floor((step - dot) / 2);
      const t = prefersReducedMotion ? 1.5 : ((now - start) / 1000) * speed;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width / step);
      const rows = Math.ceil(canvas.height / step);
      const r = Math.round(rgb[0] * 255);
      const g = Math.round(rgb[1] * 255);
      const b = Math.round(rgb[2] * 255);

      for (let y = 0; y < rows; y += 1) {
        const ny = y / Math.max(1, rows);
        for (let x = 0; x < cols; x += 1) {
          const nx = x / Math.max(1, cols);
          const wave =
            0.48 +
            0.32 * Math.sin(nx * 4.2 + t * 0.65) * Math.cos(ny * 3.4 - t * 0.45) +
            0.24 * Math.sin(nx * 2.4 - ny * 3.1 + t * 0.5);
          const lum = Math.max(0, Math.min(1, wave)) * effectiveIntensity;
          const threshold = BAYER_4X4[(y % 4) * 4 + (x % 4)];
          if (lum >= threshold) {
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(0.25 + 0.45 * lum).toFixed(2)})`;
            ctx.fillRect(x * step + offset, y * step + offset, dot, dot);
          }
        }
      }

      if (!prefersReducedMotion && isVisible && document.visibilityState === 'visible') {
        rafId = requestAnimationFrame(draw2d);
      }
    };

    const ro = new ResizeObserver(() => draw2d(performance.now()));
    ro.observe(canvas);
    draw2d(start);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [isDark, pattern, cellSize, dotRatio, speed, intensity, lightColor, darkColor]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
};
