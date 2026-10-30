import React, { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

    let animId;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e) => {
      currentX = e.clientX;
      currentY = e.clientY;
      setPos({ x: currentX, y: currentY });
      if (!isVisible) setIsVisible(true);

      const target = e.target;
      if (!target || !target.tagName) return;

      const clickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'SELECT' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        (typeof target.closest === 'function' && (target.closest('button') || target.closest('a')));

      setIsPointer(!!clickable);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      setTrailing((prev) => ({
        x: prev.x + (currentX - prev.x) * 0.2,
        y: prev.y + (currentY - prev.y) * 0.2,
      }));
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75 z-50 ${
          isPointer
            ? 'w-10 h-10 bg-indigo-500/20 border border-indigo-400/50 scale-125'
            : 'w-6 h-6 bg-cyan-500/15 border border-cyan-400/30'
        }`}
        style={{ left: `${trailing.x}px`, top: `${trailing.y}px` }}
      />
      <div
        className={`pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 rounded-full z-50 ${
          isPointer ? 'w-2 h-2 bg-brand-400' : 'w-1.5 h-1.5 bg-cyan-400'
        }`}
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />
    </>
  );
};

export default CustomCursor;
