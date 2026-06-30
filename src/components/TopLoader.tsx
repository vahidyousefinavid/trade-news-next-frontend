'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function TopLoader() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathname = useRef(pathname);
  const running = useRef(false);

  const clearAll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  };

  const start = () => {
    if (running.current) return;
    running.current = true;
    clearAll();
    setVisible(true);
    let w = 10;
    setWidth(w);
    intervalRef.current = setInterval(() => {
      w += Math.random() * 12 + 3;
      if (w >= 82) { w = 82; clearInterval(intervalRef.current!); }
      setWidth(w);
    }, 220);
  };

  const finish = () => {
    running.current = false;
    clearAll();
    setWidth(100);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setWidth(0), 250);
    }, 320);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) return;
      if (anchor.target === '_blank') return;
      const stripped = href.split('?')[0].split('#')[0];
      if (stripped === pathname || stripped === '') return;
      start();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== prevPathname.current) { prevPathname.current = pathname; finish(); }
  }, [pathname]);

  useEffect(() => () => clearAll(), []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      style={{ height: '3px', opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}>
      <div style={{
        height: '100%', width: `${width}%`,
        background: 'linear-gradient(to right, #990000, #CC0000, #FF3333)',
        boxShadow: '0 0 10px #CC000088, 0 0 4px #CC000044',
        borderRadius: '0 3px 3px 0',
        transition: width === 100 ? 'width 0.2s ease-out' : 'width 0.22s ease',
      }} />
    </div>
  );
}
