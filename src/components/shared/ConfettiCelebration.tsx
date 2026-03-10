import { useEffect, useRef } from "react";

const CONFETTI_COLORS = ["#E9EBF6", "#6065AE", "#989ECB", "#4142A3"];
const PARTICLE_COUNT = 100;
const DURATION = 4500;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  length: number;
  thickness: number;
  rotation: number;
  rotationSpeed: number;
  shape: "ribbon" | "squiggle" | "dot";
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  /** Controls the "twist" perspective of ribbons */
  twist: number;
  twistSpeed: number;
}

function createParticle(width: number, height: number): Particle {
  const shapes: Particle["shape"][] = ["ribbon", "ribbon", "squiggle", "squiggle", "ribbon", "dot"];
  return {
    x: width * 0.1 + Math.random() * width * 0.8,
    y: -10 - Math.random() * 40,
    vx: (Math.random() - 0.5) * 6,
    vy: Math.random() * 2.5 + 1.5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    length: Math.random() * 18 + 10,
    thickness: Math.random() * 2.5 + 1.5,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.15,
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    opacity: 1,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.06 + 0.02,
    wobbleAmp: Math.random() * 1.5 + 0.5,
    twist: Math.random() * Math.PI * 2,
    twistSpeed: Math.random() * 0.08 + 0.03,
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
    let spawned = 0;
    const startTime = performance.now();
    let animId: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn particles over first 600ms
      while (spawned < PARTICLE_COUNT && elapsed > (spawned / PARTICLE_COUNT) * 600) {
        particles.push(createParticle(canvas.width, canvas.height));
        spawned++;
      }

      for (const p of particles) {
        p.vy += 0.08; // gentle gravity
        p.wobble += p.wobbleSpeed;
        p.twist += p.twistSpeed;
        p.x += p.vx + Math.sin(p.wobble) * p.wobbleAmp;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.vx *= 0.995;

        // Fade out in last 1.2s
        if (elapsed > DURATION - 1200) {
          p.opacity = Math.max(0, 1 - (elapsed - (DURATION - 1200)) / 1200);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;

        if (p.shape === "ribbon") {
          // A twisting ribbon: width varies with twist to simulate 3D
          const scaleX = Math.cos(p.twist);
          ctx.scale(scaleX === 0 ? 0.05 : scaleX, 1);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          // Rounded rectangle ribbon
          const hw = p.thickness;
          const hh = p.length / 2;
          ctx.moveTo(-hw, -hh);
          ctx.quadraticCurveTo(-hw - 1, 0, -hw, hh);
          ctx.lineTo(hw, hh);
          ctx.quadraticCurveTo(hw + 1, 0, hw, -hh);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === "squiggle") {
          // Wavy serpentine line — the signature squiggle
          const scaleX = Math.cos(p.twist);
          ctx.scale(scaleX === 0 ? 0.05 : scaleX, 1);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.thickness;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          const segments = 3;
          const segLen = p.length / segments;
          const amp = p.length * 0.2;
          ctx.moveTo(0, -p.length / 2);
          for (let i = 0; i < segments; i++) {
            const yStart = -p.length / 2 + i * segLen;
            const dir = i % 2 === 0 ? 1 : -1;
            ctx.quadraticCurveTo(
              amp * dir,
              yStart + segLen / 2,
              0,
              yStart + segLen
            );
          }
          ctx.stroke();
        } else {
          // Small dot
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.thickness + 0.5, 0, Math.PI * 2);
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
