'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import type { News } from '@/lib/api';

type Variant = 'default' | 'hero' | 'hero-sm' | 'horizontal' | 'compact' | 'feature' | 'list' | 'top-feature' | 'ranked' | 'headline';

function fmtDate(date: string | null, locale: string) {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}
function fmtShort(date: string | null, locale: string) {
  if (!date) return '';
  return new Date(date).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

/* ── Hero (full bleed) ── */
function HeroCard({ news }: { news: News }) {
  const { t } = useLang();
  const date = news.publishedAt || news.createdAt;
  return (
    <Link href={`/news/${news.id}`} className="card-hero">
      {news.image
        ? <img src={news.image} alt={news.title} className="card-hero-img" />
        : <div className="card-hero-img" style={{ background: 'linear-gradient(145deg,#0B1929,#172E47)' }} />}
      <div className="card-hero-overlay" />
      <div className="card-hero-body">
        {news.isBreaking && <span className="breaking-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>فوری</span>}
        {!news.isBreaking && news.category && (
          <span className="cat-badge-pill" style={{ backgroundColor: news.category.color || 'var(--red)', display: 'inline-block', marginBottom: '0.5rem' }}>
            {news.category.name}
          </span>
        )}
        <h2 className="card-hero-title">{news.title}</h2>
        {news.summary && <p className="card-hero-summary">{news.summary}</p>}
        <div className="card-hero-meta">
          <span>{fmtDate(date, t.locale)}</span>
          <span>·</span>
          <span>{(news.views || 0).toLocaleString(t.locale)} بازدید</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Hero SM ── */
function HeroSmCard({ news }: { news: News }) {
  const { t } = useLang();
  const date = news.publishedAt || news.createdAt;
  const smCatColor = news.category?.color || '#C8000A';
  return (
    <Link href={`/news/${news.id}`} className="card-hero-sm">
      {news.image
        ? <img src={news.image} alt={news.title} />
        : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(145deg, #0B1929 0%, ${smCatColor}44 100%)` }} />}
      <div className="card-hero-sm-overlay" />
      <div className="card-hero-sm-body">
        {news.category && (
          <span style={{ fontSize: '0.58rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', color: news.category.color || 'var(--red)', display: 'block', marginBottom: '0.25rem' }}>
            {news.category.name}
          </span>
        )}
        <h3 className="card-hero-sm-title">{news.title}</h3>
        <span style={{ fontSize: '0.67rem', color: 'rgba(255,255,255,.4)', display: 'block', marginTop: '0.3rem', fontWeight: 600 }}>
          {fmtShort(date, t.locale)}
        </span>
      </div>
    </Link>
  );
}

/* ── Feature card (grid) ── */
function FeatureCard({ news, large }: { news: News; large?: boolean }) {
  const { t } = useLang();
  const date = news.publishedAt || news.createdAt;
  const catColor = news.category?.color || 'var(--red)';
  return (
    <Link href={`/news/${news.id}`} className={`card-feature${large ? ' large' : ''}`}>
      <div className="card-feature-img-wrap">
        {news.image
          ? <img src={news.image} alt={news.title} className="card-feature-img" />
          : (
            <div style={{ width: '100%', height: '100%', background: `linear-gradient(145deg, ${catColor}18 0%, ${catColor}08 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.12) 0%, transparent 60%)' }} />
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.18 }}>
                <rect x="6" y="10" width="36" height="28" rx="4" stroke={catColor} strokeWidth="2.5" />
                <line x1="12" y1="18" x2="36" y2="18" stroke={catColor} strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="24" x2="36" y2="24" stroke={catColor} strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="30" x2="26" y2="30" stroke={catColor} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          )}
        {/* Category / breaking overlay at bottom of image */}
        <div className="card-feature-cat-wrap">
          {news.isBreaking
            ? <span className="card-list-badge">فوری</span>
            : news.category && <span className="card-feature-cat-text">{news.category.name}</span>}
        </div>
      </div>
      <div className="card-feature-body">
        <h3 className="card-feature-title">{news.title}</h3>
        <div className="card-feature-meta">
          <span>{fmtShort(date, t.locale)}</span>
          {news.views ? (
            <>
              <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--border-2)', display: 'inline-block', flexShrink: 0 }} />
              <span>{(news.views).toLocaleString(t.locale)}</span>
            </>
          ) : null}
          {news.source && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: 'var(--border-2)', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ color: catColor }}>{news.source}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ── List card (news archive) ── */
function ListCard({ news, num }: { news: News; num?: number }) {
  const { t } = useLang();
  const date = news.publishedAt || news.createdAt;
  const catColor = news.category?.color || 'var(--red)';
  return (
    <Link href={`/news/${news.id}`} className="card-list">
      {num !== undefined && (
        <span className="card-list-num">{String(num).padStart(2, '0')}</span>
      )}
      <div className="card-list-body">
        <div className="card-list-header">
          {news.isBreaking && <span className="card-list-badge">فوری</span>}
          {news.category && (
            <span className="card-list-cat" style={{ color: catColor }}>{news.category.name}</span>
          )}
          {date && <><span className="card-list-divider" /><span className="card-list-date">{fmtDate(date, t.locale)}</span></>}
        </div>
        <h3 className="card-list-title">{news.title}</h3>
        {news.summary && <p className="card-list-summary">{news.summary}</p>}
      </div>
      {news.image && (
        <div className="card-list-img">
          <img src={news.image} alt={news.title} />
        </div>
      )}
    </Link>
  );
}

/* ── Top feature (featured at top of list page) ── */
function TopFeatureCard({ news }: { news: News }) {
  const { t } = useLang();
  const date = news.publishedAt || news.createdAt;
  const catColor = news.category?.color || 'var(--red)';
  return (
    <Link href={`/news/${news.id}`} className="card-top-feature">
      {news.image && (
        <div className="card-top-feature-img">
          <img src={news.image} alt={news.title} />
        </div>
      )}
      <div className="card-top-feature-body">
        <div className="card-top-feature-eyebrow">
          {news.isBreaking && <span className="card-list-badge">فوری</span>}
          {news.category && <span className="card-top-feature-cat" style={{ color: catColor }}>{news.category.name}</span>}
          {date && <><span className="card-list-divider" /><span className="card-top-feature-date">{fmtDate(date, t.locale)}</span></>}
        </div>
        <h2 className="card-top-feature-title">{news.title}</h2>
        {news.summary && <p className="card-top-feature-summary">{news.summary}</p>}
        <div className="card-top-feature-meta">
          {news.views ? <span>{(news.views).toLocaleString(t.locale)} بازدید</span> : null}
          {news.source && <><span className="card-list-divider" /><span>{news.source}</span></>}
          <span className="card-top-feature-cta">ادامه مطلب ←</span>
        </div>
      </div>
    </Link>
  );
}

/* ── Ranked card (dark editorial sidebar) ── */
function RankedCard({ news, num }: { news: News; num?: number }) {
  const { t } = useLang();
  const date = news.publishedAt || news.createdAt;
  const catColor = news.category?.color || 'var(--red)';
  return (
    <Link href={`/news/${news.id}`} className="card-ranked">
      {num !== undefined && (
        <span className="card-ranked-num">{String(num).padStart(2, '0')}</span>
      )}
      <div className="card-ranked-body">
        <div className="card-ranked-meta">
          {news.category && (
            <span style={{ color: catColor }}>{news.category.name}</span>
          )}
          {date && (
            <>
              <span className="card-ranked-dot" />
              <span>{fmtShort(date, t.locale)}</span>
            </>
          )}
        </div>
        <h3 className="card-ranked-title">{news.title}</h3>
      </div>
    </Link>
  );
}

/* ── Headline card (light editorial secondary column) ── */
function HeadlineCard({ news }: { news: News }) {
  const { t } = useLang();
  const date = news.publishedAt || news.createdAt;
  const catColor = news.category?.color || 'var(--red)';
  return (
    <Link href={`/news/${news.id}`} className="card-headline">
      <div className="card-headline-body">
        {news.category && (
          <span className="card-headline-cat" style={{ color: catColor }}>
            {news.category.name}
          </span>
        )}
        <h3 className="card-headline-title">{news.title}</h3>
        {date && <span className="card-headline-date">{fmtShort(date, t.locale)}</span>}
      </div>
      {news.image && (
        <div className="card-headline-img">
          <img src={news.image} alt={news.title} />
        </div>
      )}
    </Link>
  );
}

/* ── Horizontal (sidebar related) ── */
function HorizontalCard({ news }: { news: News }) {
  const { t } = useLang();
  const date = news.publishedAt || news.createdAt;
  return (
    <Link href={`/news/${news.id}`} className="card-horiz">
      {news.image && (
        <div className="card-horiz-img">
          <img src={news.image} alt={news.title} />
        </div>
      )}
      <div className="card-horiz-body">
        {news.category && (
          <span style={{ fontSize: '0.58rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', color: news.category.color || 'var(--red)', display: 'block', marginBottom: '0.2rem' }}>
            {news.category.name}
          </span>
        )}
        <h3 className="card-horiz-title">{news.title}</h3>
        <span className="card-horiz-date">{fmtShort(date, t.locale)}</span>
      </div>
    </Link>
  );
}

/* ── Compact (sidebar list) ── */
function CompactCard({ news }: { news: News }) {
  const { t } = useLang();
  const date = news.publishedAt || news.createdAt;
  return (
    <Link href={`/news/${news.id}`} className="card-compact">
      {news.category && (
        <span style={{ fontSize: '0.58rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.14em', color: news.category.color || 'var(--red)', display: 'block', marginBottom: '0.1rem' }}>
          {news.category.name}
        </span>
      )}
      <h3 className="card-compact-title">{news.title}</h3>
      <span className="card-compact-date">{fmtShort(date, t.locale)}</span>
    </Link>
  );
}

/* ── Export ── */
export function NewsCard({
  news,
  variant = 'default',
  num,
  large,
}: {
  news: News;
  variant?: Variant;
  num?: number;
  large?: boolean;
}) {
  if (variant === 'hero')        return <HeroCard news={news} />;
  if (variant === 'hero-sm')     return <HeroSmCard news={news} />;
  if (variant === 'feature')     return <FeatureCard news={news} large={large} />;
  if (variant === 'list')        return <ListCard news={news} num={num} />;
  if (variant === 'top-feature') return <TopFeatureCard news={news} />;
  if (variant === 'ranked')      return <RankedCard news={news} num={num} />;
  if (variant === 'headline')    return <HeadlineCard news={news} />;
  if (variant === 'horizontal')  return <HorizontalCard news={news} />;
  if (variant === 'compact')     return <CompactCard news={news} />;
  return <FeatureCard news={news} />;
}
