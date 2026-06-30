'use client';

import Link from 'next/link';
import { useLang } from '@/context/LangContext';
import type { Category } from '@/lib/api';

export function Footer({ categories }: { categories: Category[] }) {
  const { t } = useLang();

  return (
    <footer className="site-footer">
      <div className="footer-accent" />

      <div className="footer-main" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }} className="md:col-span-2">
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1rem', textDecoration: 'none' }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}>TRADE</span>
              <span style={{ color: 'var(--red)', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1 }}>NEWS</span>
            </Link>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.9, maxWidth: '20rem' }}>{t.footerDesc}</p>
          </div>

          {/* Topics */}
          <div>
            <h4 className="footer-title">{t.footerLinks}</h4>
            <nav style={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/" className="footer-link">
                <span className="footer-dot" style={{ backgroundColor: 'var(--red)' }} />
                {t.nav.home}
              </Link>
              <Link href="/news" className="footer-link">
                <span className="footer-dot" style={{ backgroundColor: 'var(--red)' }} />
                {t.nav.news}
              </Link>
              {categories.slice(0, 5).map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug || cat.id}`} className="footer-link">
                  <span className="footer-dot" style={{ backgroundColor: cat.color || 'var(--red)' }} />
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* About */}
          <div>
            <h4 className="footer-title">{t.footerAbout}</h4>
            <p style={{ fontSize: '0.8125rem', lineHeight: 1.9 }}>{t.aboutText}</p>
            <a href="mailto:news@tradenews.ir" className="footer-link" style={{ marginTop: '0.75rem' }}>
              news@tradenews.ir
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom" style={{ maxWidth: 1280, margin: '0 auto' }}>
        <span>{t.copyright}</span>
        <span style={{ color: 'rgba(255,255,255,.15)' }}>{t.rights}</span>
      </div>
    </footer>
  );
}
