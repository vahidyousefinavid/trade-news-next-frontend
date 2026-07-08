import Link from 'next/link';
import { getAllNews, getAllCategories } from '@/lib/api';
import { NewsCard } from '@/components/NewsCard';
import { BreakingTicker } from '@/components/BreakingTicker';
import { LangText } from '@/components/LangText';

const MARKETS = [
  { name: 'طلا (گرم)',   value: '۴,۸۵۰,۰۰۰', change: '+۰.۸٪', up: true  },
  { name: 'دلار',        value: '۵۸,۰۰۰',      change: '+۱.۲٪', up: true  },
  { name: 'یورو',        value: '۶۳,۸۰۰',      change: '-۰.۳٪', up: false },
  { name: 'بورس تهران',  value: '۲,۸۹۴,۲۰۰',  change: '-۰.۴٪', up: false },
  { name: 'نفت برنت',    value: '$۸۵.۳',        change: '+۰.۶٪', up: true  },
  { name: 'بیت‌کوین',    value: '$۶۸,۲۰۰',     change: '+۲.۱٪', up: true  },
];

export default async function HomePage() {
  const [allNews, categories] = await Promise.all([
    getAllNews({ status: 'published' }),
    getAllCategories(),
  ]);

  const breaking  = allNews.filter(n => n.isBreaking);
  const featured  = allNews.find(n => n.isFeatured) ?? allNews[0];
  const pool      = allNews.filter(n => n.id !== featured?.id);
  const mostViewed = [...allNews]
    .filter(n => (n.views || 0) > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Breaking ticker ── */}
      <BreakingTicker items={breaking} />

      {/* ── Markets bar ── */}
      <div className="markets-bar">
        <div className="markets-inner">
          <div className="market-live">
            <span className="market-live-dot" />
            <span className="market-live-text"><LangText fa="زنده" en="Live" /></span>
          </div>
          {MARKETS.map(m => (
            <div key={m.name} className="market-item">
              <span className="market-name">{m.name}</span>
              <span className="market-value">{m.value}</span>
              <span className={`market-change ${m.up ? 'market-up' : 'market-down'}`}>
                {m.up ? '▲' : '▼'} {m.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category quick nav ── */}
      {categories.length > 0 && (
        <div style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--rule)', overflowX: 'auto' }}>
          <div className="cat-quicknav-inner">
            <Link href="/news" className="cat-quicknav-all">
              <LangText fa="همه اخبار" en="All News" />
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug || cat.id}`}
                className="cat-quicknav-pill"
                style={{
                  color: cat.color || 'var(--ink-2)',
                  backgroundColor: `${cat.color || '#888'}14`,
                  borderColor: `${cat.color || '#888'}28`,
                } as React.CSSProperties}
              >
                <span className="cat-quicknav-dot" style={{ backgroundColor: cat.color || '#888' }} />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          HERO  — featured card + 3 side cards
      ══════════════════════════════════════ */}
      {featured && (
        <div style={{ backgroundColor: 'var(--white)', padding: '1.375rem 0', borderBottom: '1px solid var(--rule)' }}>
          <div className="container">
            <div className="home-hero-grid">
              <NewsCard news={featured} variant="hero" />
              <div className="home-hero-side">
                {pool.slice(0, 3).map(n => (
                  <NewsCard key={n.id} news={n} variant="hero-sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          LATEST NEWS  — 4-column card grid
      ══════════════════════════════════════ */}
      {pool.length > 3 && (
        <div style={{ padding: '2rem 0' }}>
          <div className="container">
            <div className="sec-head">
              <span className="sec-head-title">
                <span className="sec-head-bar" style={{ background: 'var(--red)' }} />
                <LangText fa="آخرین اخبار" en="Latest News" />
              </span>
              <Link href="/news" className="sec-head-link">
                <LangText fa="مشاهده همه ←" en="View all →" />
              </Link>
            </div>
            <div className="card-grid-4">
              {pool.slice(3, 11).map(n => (
                <NewsCard key={n.id} news={n} variant="feature" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          CATEGORY SECTIONS
      ══════════════════════════════════════ */}
      {categories.map((cat, ci) => {
        const catNews = allNews.filter(n => n.category?.id === cat.id);
        if (catNews.length < 3) return null;
        const color = cat.color || 'var(--red)';
        const bg = ci % 2 === 0 ? 'var(--white)' : 'var(--bg)';

        return (
          <div key={cat.id} style={{ backgroundColor: bg, padding: '2rem 0', borderTop: '1px solid var(--rule)' }}>
            <div className="container">
              <div className="sec-head">
                <span className="sec-head-title">
                  <span className="sec-head-bar" style={{ background: color }} />
                  {cat.name}
                </span>
                <Link href={`/category/${cat.slug || cat.id}`} className="sec-head-link">
                  <LangText fa="مشاهده همه ←" en="View all →" />
                </Link>
              </div>
              <div className="card-grid-4">
                {catNews.slice(0, 4).map(n => (
                  <NewsCard key={n.id} news={n} variant="feature" />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* ══════════════════════════════════════
          MOST VIEWED
      ══════════════════════════════════════ */}
      {mostViewed.length >= 3 && (
        <div style={{ backgroundColor: 'var(--bg)', padding: '2.5rem 0', borderTop: '1px solid var(--rule)' }}>
          <div className="container">
            <div className="sec-head" style={{ marginBottom: '1.5rem' }}>
              <span className="sec-head-title">
                <span className="sec-head-bar" style={{ background: 'var(--red)' }} />
                <LangText fa="پربازدیدترین" en="Most Read" />
              </span>
              <Link href="/news" className="sec-head-link">
                <LangText fa="مشاهده همه ←" en="View all →" />
              </Link>
            </div>

            <div className="home-mv-grid">
              {mostViewed.map((n, i) => (
                <Link key={n.id} href={`/news/${n.id}`} className="home-mv-item">
                  <span className="home-mv-rank">{i + 1}</span>
                  <div className="home-mv-body">
                    {n.category && (
                      <span className="home-mv-cat" style={{ color: n.category.color || 'var(--red)' }}>
                        {n.category.name}
                      </span>
                    )}
                    <h3 className="home-mv-title">{n.title}</h3>
                    <span className="home-mv-views">
                      {(n.views || 0).toLocaleString('fa-IR')} بازدید
                    </span>
                  </div>
                  {n.image && (
                    <div className="home-mv-img">
                      <img src={n.image} alt={n.title} loading="lazy" decoding="async" />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="archive-cta">
        <p className="archive-cta-label">
          <LangText fa="آرشیو کامل اخبار تجاری ایران" en="Full Iranian Trade News Archive" />
        </p>
        <Link href="/news" className="archive-cta-btn">
          <LangText fa="مشاهده همه اخبار" en="Browse All Articles" />
        </Link>
      </div>

    </div>
  );
}
