import { useEffect, useRef } from "react";

const CONFETTI_COLORS = ["#2D2A6E", "#4A47A3", "#8B88C9", "#C5C3E8"];
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
  shape: "rect" | "circle" | "triangle";
  opacity: number;
}

function createParticle(width: number): Particle {
  return {
    x: width / 2 + (Math.random() - 0.5) * width * 0.4,
    y: -20,
    vx: (Math.random() - 0.5) * 8,
    vy: Math.random() * 3 + 2,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    shape: (["rect", "circle", "triangle"] as const)[Math.floor(Math.random() * 3)],
    opacity: 1,
  };
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
    // Stagger particle creation
    let spawned = 0;
    const startTime = performance.now();
    let animId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn particles over first 500ms
      while (spawned < PARTICLE_COUNT && elapsed > (spawned / PARTICLE_COUNT) * 500) {
        particles.push(createParticle(canvas.width));
        spawned++;
      }

      for (const p of particles) {
        p.vy += 0.15; // gravity
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vx *= 0.99;

        // Fade out in last second
        if (elapsed > DURATION - 1000) {
          p.opacity = Math.max(0, 1 - (elapsed - (DURATION - 1000)) / 1000);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
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
