'use client';

import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      height: 3, zIndex: 9999, pointerEvents: 'none',
      background: 'rgba(200,0,10,.1)',
    }}>
      <div style={{
        height: '100%',
        width: `${pct}%`,
        background: 'linear-gradient(90deg, #9A0007, #C8000A)',
        transition: 'width .12s linear',
        borderRadius: '0 2px 2px 0',
      }} />
    </div>
  );
}
