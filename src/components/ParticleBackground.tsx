import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  twinkleSpeed: number;
  twinkleOffset: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationId: number;
    let stars: Star[] = [];
    let time = 0;

    const colorArr = ['#D4AF37', '#00D4FF', '#7B2FBE', '#ffffff', '#FFD700'];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };

    const createStars = () => {
      const count = Math.min(100, Math.floor((canvas.width * canvas.height) / 16000));
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.3,
          opacity: Math.random() * 0.5 + 0.1,
          color: colorArr[Math.floor(Math.random() * colorArr.length)],
          twinkleSpeed: Math.random() * 0.015 + 0.003,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle nebula
      const nebulas = [
        { x: canvas.width * 0.2, y: canvas.height * 0.15, r: 300, color: 'rgba(123,47,190,0.015)' },
        { x: canvas.width * 0.8, y: canvas.height * 0.35, r: 250, color: 'rgba(0,212,255,0.01)' },
        { x: canvas.width * 0.5, y: canvas.height * 0.6, r: 350, color: 'rgba(212,175,55,0.012)' },
      ];
      nebulas.forEach((n) => {
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
      });

      // Stars (simple twinkle, no movement)
      stars.forEach((s) => {
        const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
        const alpha = s.opacity * twinkle;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    resize();
    createStars();
    animate();

    const onResize = () => { resize(); createStars(); };
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(resize);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
