'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import type { News } from '@/lib/api';

export function BreakingTicker({ items }: { items: News[] }) {
  const { t } = useLang();
  if (!items.length) return null;

  const tripled = [...items, ...items, ...items];

  return (
    <div className="ticker-bar">
      <div className="ticker-badge">
        <span className="live-dot" />
        {t.breaking}
      </div>
      <div className="ticker-track-wrap">
        <div className="ticker-track">
          {tripled.map((n, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Link href={`/news/${n.id}`} className="ticker-item">{n.title}</Link>
              <span className="ticker-sep">◆</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
