import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllCategories, getAllNews } from '@/lib/api';
import { NewsCard } from '@/components/NewsCard';
import { LangText } from '@/components/LangText';

interface Props { params: Promise<{ slug: string }> }

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find(c => c.slug === slug || c.id === slug);
  if (!category) notFound();

  const news = await getAllNews({ status: 'published', categoryId: category.id });
  const featured = news[0];
  const rest = news.slice(1);
  const color = category.color || 'var(--red)';

  return (
    <div style={{ backgroundColor: 'var(--bg)' }}>

      {/* Banner */}
      <div className="page-header" style={{ borderBottom: `4px solid ${color}` }}>
        <div className="container">
          <p className="page-header-eyebrow" style={{ color }}>
            <LangText fa="دسته‌بندی" en="Category" />
          </p>
          <h1 className="page-header-title">{category.name}</h1>
          {category.description && (
            <p className="page-header-sub">{category.description}</p>
          )}
          <p className="page-header-count">
            {news.length} <LangText fa="خبر" en="articles" />
          </p>
        </div>
      </div>

      {news.length === 0 ? (
        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 900, fontSize: '2.25rem', letterSpacing: '-0.02em', color: 'var(--border-2)' }}>
            <LangText fa="خبری یافت نشد" en="No Articles Found" />
          </p>
          <Link href="/news" style={{
            display: 'inline-block', marginTop: '1.5rem',
            color: 'var(--red)', fontWeight: 800, fontSize: '0.8rem',
            textDecoration: 'none', letterSpacing: '0.08em',
            textTransform: 'uppercase', borderBottom: '2px solid var(--red)', paddingBottom: '2px',
          }}>
            <LangText fa="بازگشت به اخبار" en="Back to News" />
          </Link>
        </div>
      ) : (
        <div className="container" style={{ padding: '2.5rem 1.5rem' }}>

          {/* Top featured */}
          {featured && (
            <div style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '2px solid var(--text)' }}>
              <p className="section-label" style={{ color }}>
                <LangText fa="مهم‌ترین" en="Featured" />
              </p>
              <NewsCard news={featured} variant="top-feature" />
            </div>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <>
              <div className="section-head">
                <div className="section-head-left">
                  <span className="section-accent" style={{ backgroundColor: color }} />
                  <h2 className="section-title">
                    {rest.length}&nbsp;<LangText fa="خبر دیگر" en="more articles" />
                  </h2>
                </div>
                <Link href="/news" className="section-view-all" style={{ color }}>
                  <LangText fa="همه اخبار" en="All News" /> →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" style={{ gap: '1.75rem' }}>
                {rest.map(n => <NewsCard key={n.id} news={n} variant="feature" />)}
              </div>
            </>
          )}

          {/* Other categories */}
          {categories.length > 1 && (
            <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <p style={{
                fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.18em', color: 'var(--text-3)', marginBottom: '0.875rem',
              }}>
                <LangText fa="سایر دسته‌بندی‌ها" en="Other Categories" />
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {categories.filter(c => c.id !== category.id).map(cat => (
                  <Link key={cat.id} href={`/category/${cat.slug || cat.id}`}
                    className="filter-chip"
                    style={{ backgroundColor: cat.color || 'var(--ink)', color: '#fff', borderColor: 'transparent' }}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
