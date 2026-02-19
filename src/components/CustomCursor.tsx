import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(hover: none)').matches) return;

    const handleMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleEnter = () => setIsVisible(true);
    const handleLeave = () => setIsVisible(false);

    // Detect hoverable elements
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, .cursor-pointer')) {
        setIsHovering(true);
      }
    };
    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], input, textarea, .cursor-pointer')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseenter', handleEnter);
    document.addEventListener('mouseleave', handleLeave);
    document.addEventListener('mouseover', handleOver);
    document.addEventListener('mouseout', handleOut);

    let raf: number;
    const animate = () => {
      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      // Glow follows with lerp
      glowPos.current.x += (pos.current.x - glowPos.current.x) * 0.12;
      glowPos.current.y += (pos.current.y - glowPos.current.y) * 0.12;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${glowPos.current.x}px, ${glowPos.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseenter', handleEnter);
      document.removeEventListener('mouseleave', handleLeave);
      document.removeEventListener('mouseover', handleOver);
      document.removeEventListener('mouseout', handleOut);
      cancelAnimationFrame(raf);
    };
  }, [isVisible]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }

  return (
    <>
      {/* Glow circle - follows with delay */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        style={{
          width: isHovering ? 60 : 40,
          height: isHovering ? 60 : 40,
          borderRadius: '50%',
          background: isHovering
            ? 'radial-gradient(circle, rgba(212,175,55,0.15), rgba(212,175,55,0.05) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%)',
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.3s, height 0.3s, background 0.3s, opacity 0.3s',
        }}
      />
      {/* Dot - follows instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10001] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: isHovering ? 6 : 4,
          height: isHovering ? 6 : 4,
          borderRadius: '50%',
          backgroundColor: '#D4AF37',
          boxShadow: '0 0 8px rgba(212,175,55,0.6)',
          opacity: isVisible ? 1 : 0,
          transition: 'width 0.2s, height 0.2s, opacity 0.2s',
        }}
      />
    </>
  );
}
