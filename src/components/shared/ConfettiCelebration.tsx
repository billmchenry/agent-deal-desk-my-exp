import { useEffect, useRef } from "react";

const CONFETTI_COLORS = ["#E9EBF6", "#6065AE", "#989ECB", "#4142A3"];
const PARTICLE_COUNT = 80;
const DURATION = 4000;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: "squiggle" | "curl" | "dot";
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

function createParticle(width: number): Particle {
  return {
    x: width / 2 + (Math.random() - 0.5) * width * 0.4,
    y: -20,
    vx: (Math.random() - 0.5) * 8,
    vy: Math.random() * 3 + 2,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 12 + 8,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    shape: (["squiggle", "squiggle", "curl", "curl", "dot"] as const)[
      Math.floor(Math.random() * 5)
    ],
    opacity: 1,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.1 + 0.03,
  };
}

function drawSquiggle(ctx: CanvasRenderingContext2D, size: number) {
  const amplitude = size * 0.35;
  const length = size;
  ctx.beginPath();
  ctx.moveTo(-length / 2, 0);
  ctx.bezierCurveTo(
    -length / 4, -amplitude,
    0, amplitude,
    length / 4, -amplitude * 0.5
  );
  ctx.bezierCurveTo(
    length / 3, amplitude * 0.8,
    length * 0.4, -amplitude * 0.3,
    length / 2, 0
  );
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.stroke();
}

function drawCurl(ctx: CanvasRenderingContext2D, size: number) {
  const r = size * 0.4;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.bezierCurveTo(
    r * 1.5, -r,
    r * 1.5, r,
    0, r * 0.5
  );
  ctx.bezierCurveTo(
    -r * 0.8, r * 0.2,
    -r * 0.6, -r * 0.8,
    r * 0.2, -r * 0.3
  );
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.stroke();
}

function drawDot(ctx: CanvasRenderingContext2D, size: number) {
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
}

export function ConfettiCelebration() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Particle[] = [];
    let spawned = 0;
    const startTime = performance.now();
    let animId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      while (spawned < PARTICLE_COUNT && elapsed > (spawned / PARTICLE_COUNT) * 500) {
        particles.push(createParticle(canvas.width));
        spawned++;
      }

      for (const p of particles) {
        p.vy += 0.15;
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * 0.5;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vx *= 0.99;

        if (elapsed > DURATION - 1000) {
          p.opacity = Math.max(0, 1 - (elapsed - (DURATION - 1000)) / 1000);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;

        if (p.shape === "squiggle") {
          drawSquiggle(ctx, p.size);
        } else if (p.shape === "curl") {
          drawCurl(ctx, p.size);
        } else {
          drawDot(ctx, p.size);
        }

        ctx.restore();
      }

      if (elapsed < DURATION) {
        animId = requestAnimationFrame(animate);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden="true"
    />
  );
}
