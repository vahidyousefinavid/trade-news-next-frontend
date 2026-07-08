import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNewsById, getAllNews } from '@/lib/api';
import { NewsCard } from '@/components/NewsCard';
import { NewsViewTracker } from '@/components/NewsViewTracker';
import { LangText } from '@/components/LangText';
import { ReadingProgress } from '@/components/ReadingProgress';
import { SharePanel } from '@/components/SharePanel';

interface Props { params: Promise<{ slug: string }> }

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const news = await getNewsById(slug);
  if (!news) notFound();

  const [related, allPublished] = await Promise.all([
    getAllNews({ status: 'published', ...(news.category ? { categoryId: news.category.id } : {}) })
      .then(list => list.filter(n => n.id !== news.id).slice(0, 4)),
    getAllNews({ status: 'published' }),
  ]);

  const mostViewed = [...allPublished]
    .filter(n => n.id !== news.id && (n.views || 0) > 0)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  const date = news.publishedAt || news.createdAt;
  const readingMins = Math.max(1, Math.ceil(news.content.split(' ').length / 180));

  return (
    <div style={{ backgroundColor: 'var(--white)' }}>
      <NewsViewTracker id={news.id} />
      <ReadingProgress />

      {/* Hero image */}
      {news.image && (
        <div style={{ width: '100%', overflow: 'hidden', maxHeight: 'clamp(180px, 38vw, 520px)' }}>
          <img
            src={news.image}
            alt={news.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            style={{ width: '100%', height: 'clamp(180px, 38vw, 520px)', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <div className="article-container">
        <div className="article-layout">

          {/* ── Article column ── */}
          <article className="article-main">

            {/* Breadcrumb */}
            <nav style={{
              display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.25rem',
              fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '0.06em', color: 'var(--text-3)', marginBottom: '1.25rem',
            }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <LangText fa="صفحه اصلی" en="Home" />
              </Link>
              <span>›</span>
              <Link href="/news" style={{ textDecoration: 'none', color: 'inherit' }}>
                <LangText fa="اخبار" en="News" />
              </Link>
              {news.category && (
                <>
                  <span>›</span>
                  <Link href={`/category/${news.category.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {news.category.name}
                  </Link>
                </>
              )}
            </nav>

            {/* Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
              {news.isBreaking && (
                <span className="breaking-badge">
                  <LangText fa="فوری" en="Breaking" />
                </span>
              )}
              {news.isFeatured && !news.isBreaking && (
                <span style={{
                  display: 'inline-block', fontSize: '0.65rem', fontWeight: 900,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: '#fff',
                  backgroundColor: '#1d4ed8', padding: '0.25rem 0.625rem',
                }}>
                  <LangText fa="ویژه" en="Featured" />
                </span>
              )}
              {news.category && (
                <Link
                  href={`/category/${news.category.id}`}
                  style={{
                    fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase',
                    letterSpacing: '0.1em', color: news.category.color || 'var(--gold-d)',
                    textDecoration: 'none',
                  }}
                >
                  {news.category.name}
                </Link>
              )}
            </div>

            {/* Title */}
            <h1 style={{
              fontWeight: 900, fontSize: 'clamp(1.375rem, 5vw, 2.5rem)',
              lineHeight: 1.25, letterSpacing: '-0.015em', marginBottom: '1.25rem',
            }}>
              {news.title}
            </h1>

            {/* Summary */}
            {news.summary && (
              <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', lineHeight: 1.85, fontWeight: 500,
                color: 'var(--text-2)', marginBottom: '1.5rem',
                paddingInlineStart: '1rem',
                borderInlineStart: '4px solid var(--gold-d)',
              }}>
                {news.summary}
              </p>
            )}

            {/* Meta bar */}
            <div style={{
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem',
              padding: '0.875rem 0',
              borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)',
              marginBottom: '0',
              fontSize: '0.8125rem', color: 'var(--text-3)',
            }}>
              <span>
                {date ? new Date(date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </span>
              <span>{(news.views || 0).toLocaleString('fa-IR')} <LangText fa="بازدید" en="views" /></span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase',
                letterSpacing: '0.08em', color: 'var(--gold-d)',
              }}>
                {readingMins} <LangText fa="دقیقه مطالعه" en="min read" />
              </span>
              {news.source && (
                <span style={{ marginInlineStart: 'auto', fontSize: '0.72rem', color: 'var(--text-3)', fontWeight: 600 }}>
                  منبع: {news.source}
                </span>
              )}
            </div>

            {/* Share panel — top */}
            <SharePanel title={news.title} />

            {/* Body */}
            <div className="article-body" style={{ whiteSpace: 'pre-line' }}>{news.content}</div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
                marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)',
              }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase',
                  letterSpacing: '0.1em', color: 'var(--text-3)', marginInlineEnd: '0.25rem',
                }}>
                  <LangText fa="برچسب:" en="Tags:" />
                </span>
                {news.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: '0.75rem', padding: '0.3rem 0.75rem', fontWeight: 600,
                    backgroundColor: 'var(--bg-2)', color: 'var(--text-2)',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share panel — bottom */}
            <div style={{ marginTop: '2rem' }}>
              <SharePanel title={news.title} />
            </div>

            {/* Related articles — bottom (mobile + desktop) */}
            {related.length > 0 && (
              <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px solid var(--text)' }}>
                <p className="section-label">
                  <LangText fa="اخبار مرتبط" en="Related Articles" />
                </p>
                <div className="card-grid-2" style={{ marginTop: '1rem' }}>
                  {related.slice(0, 4).map(n => (
                    <NewsCard key={n.id} news={n} variant="feature" />
                  ))}
                </div>
              </div>
            )}

          </article>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block" style={{ width: 280, flexShrink: 0 }}>
            <div style={{ position: 'sticky', top: 120 }}>

              {/* Related */}
              {related.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <p style={{
                    fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase',
                    letterSpacing: '0.15em', color: 'var(--text-3)', marginBottom: '0.5rem',
                  }}>
                    <LangText fa="اخبار مرتبط" en="Related" />
                  </p>
                  <hr style={{ border: 'none', borderTop: '2px solid var(--text)', marginBottom: '0.75rem' }} />
                  {related.map(n => <NewsCard key={n.id} news={n} variant="horizontal" />)}
                </div>
              )}

              {/* Most viewed */}
              {mostViewed.length > 0 && (
                <div>
                  <p style={{
                    fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase',
                    letterSpacing: '0.15em', color: 'var(--text-3)', marginBottom: '0.5rem',
                  }}>
                    <LangText fa="پربازدیدترین" en="Most Read" />
                  </p>
                  <hr style={{ border: 'none', borderTop: '2px solid var(--text)', marginBottom: '0.75rem' }} />
                  {mostViewed.map((n, i) => (
                    <Link key={n.id} href={`/news/${n.id}`} className="most-viewed-item">
                      <span className="most-viewed-num">{i + 1}</span>
                      <span className="most-viewed-title">{n.title}</span>
                    </Link>
                  ))}
                </div>
              )}

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
