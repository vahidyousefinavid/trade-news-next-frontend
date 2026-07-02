import Link from 'next/link';
import { getAllNews, getAllCategories } from '@/lib/api';
import { NewsCard } from '@/components/NewsCard';
import { LangText } from '@/components/LangText';

interface Props { searchParams: Promise<{ categoryId?: string }> }

export default async function NewsPage({ searchParams }: Props) {
  const { categoryId } = await searchParams;
  const [news, categories] = await Promise.all([
    getAllNews({ status: 'published', ...(categoryId ? { categoryId } : {}) }),
    getAllCategories(),
  ]);

  const activeCat   = categories.find(c => c.id === categoryId);
  const accentColor = activeCat?.color || 'var(--red)';
  const topStory    = news[0];
  const rest        = news.slice(1);
  const topViewed   = [...news].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  return (
    <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh' }}>

      {/* ── Page header ── */}
      <div className="page-header" style={{ borderBottom: `4px solid ${accentColor}` }}>
        <div className="container">
          <p className="page-header-eyebrow" style={{ color: accentColor }}>
            {activeCat
              ? <LangText fa="دسته‌بندی" en="Category" />
              : <LangText fa="آرشیو اخبار" en="News Archive" />}
          </p>
          <h1 className="page-header-title">
            {activeCat ? activeCat.name : <LangText fa="همه اخبار" en="All News" />}
          </h1>
          {activeCat?.description && (
            <p className="page-header-sub">{activeCat.description}</p>
          )}
          <p className="page-header-count">
            {news.length} <LangText fa="خبر" en="articles" />
          </p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="filter-bar" style={{ position: 'sticky', top: 95, zIndex: 40 }}>
        <div className="filter-inner">
          <Link href="/news" className={!categoryId ? 'filter-chip active' : 'filter-chip'}>
            <LangText fa="همه" en="All" />
          </Link>
          {categories.map(cat => (
            <Link
              key={cat.id}
              href={`/news?categoryId=${cat.id}`}
              className={categoryId === cat.id ? 'filter-chip active-color' : 'filter-chip'}
              style={categoryId === cat.id
                ? { backgroundColor: cat.color || 'var(--red)', borderColor: 'transparent' }
                : {}}>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {news.length === 0 ? (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <p style={{
            fontWeight: 900, fontSize: '2.25rem', letterSpacing: '-0.02em',
            color: 'var(--border-2)', lineHeight: 1.2,
          }}>
            <LangText fa="خبری یافت نشد" en="No Articles Found" />
          </p>
          <Link href="/news" style={{
            display: 'inline-block', marginTop: '1.5rem',
            color: 'var(--red)', fontWeight: 800, fontSize: '0.8rem',
            textDecoration: 'none', letterSpacing: '0.08em',
            textTransform: 'uppercase', borderBottom: '2px solid var(--red)',
            paddingBottom: '2px',
          }}>
            <LangText fa="بازگشت به همه اخبار" en="View all articles" />
          </Link>
        </div>
      ) : (
        <div className="container inner-page-container">
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>

            {/* ── Main column ── */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Top story — open, no box */}
              {topStory && (
                <div style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: `2px solid var(--text)` }}>
                  <p className="section-label" style={{ color: accentColor }}>
                    <LangText fa="مهم‌ترین خبر" en="Top Story" />
                  </p>
                  <NewsCard news={topStory} variant="top-feature" />
                </div>
              )}

              {/* List of remaining articles */}
              {rest.length > 0 && (
                <>
                  <div className="section-head">
                    <div className="section-head-left">
                      <span className="section-accent" style={{ backgroundColor: accentColor }} />
                      <h2 className="section-title">
                        {rest.length}&nbsp;<LangText fa="خبر دیگر" en="more articles" />
                      </h2>
                    </div>
                  </div>

                  <div>
                    {rest.map((n, i) => (
                      <NewsCard key={n.id} news={n} variant="list" num={i + 2} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* ── Sidebar ── */}
            <aside className="hidden xl:block" style={{ width: 264, flexShrink: 0 }}>

              {/* Categories */}
              <div className="sidebar-box">
                <p className="sidebar-title">
                  <LangText fa="دسته‌بندی‌ها" en="Categories" />
                </p>
                {categories.map(cat => (
                  <Link key={cat.id} href={`/category/${cat.slug || cat.id}`} className="cat-sidebar-link">
                    <span style={{
                      width: 10, height: 10, borderRadius: 2, flexShrink: 0,
                      backgroundColor: cat.color || '#9CA3AF',
                    }} />
                    <span style={{ flex: 1 }}>{cat.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-4)' }}>›</span>
                  </Link>
                ))}
              </div>

              {/* Most viewed */}
              {topViewed.length > 0 && (
                <div className="sidebar-box">
                  <p className="sidebar-title">
                    <LangText fa="پربازدیدترین" en="Most Read" />
                  </p>
                  {topViewed.map((n, i) => (
                    <Link key={n.id} href={`/news/${n.id}`} className="most-viewed-item">
                      <span className="most-viewed-num">{i + 1}</span>
                      <span className="most-viewed-title">{n.title}</span>
                    </Link>
                  ))}
                </div>
              )}

            </aside>
          </div>
        </div>
      )}
    </div>
  );
}
