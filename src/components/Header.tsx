'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useLang } from '@/context/LangContext';
import type { Category } from '@/lib/api';

export function Header({ categories }: { categories: Category[] }) {
  const { t, locale, toggle } = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="site-header">
      <div className="header-accent-bar" />

      {/* Main nav row */}
      <div className="header-main" style={{ maxWidth: 1440, margin: '0 auto' }}>
        <Link href="/" className="header-logo">
          <span className="site-brand">سامانه جامع تجارت</span>
        </Link>

        {/* Desktop nav */}
        <nav className="header-nav hidden md:flex">
          {[
            { href: '/',     label: t.nav.home },
            { href: '/news', label: t.nav.news },
          ].map(({ href, label }) => (
            <Link key={href} href={href}
              className={'nav-link' + (isActive(href) ? ' active' : '')}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-spacer" />

        {/* Live */}
        <div className="hidden sm:flex" style={{ alignItems: 'center', gap: '0.375rem' }}>
          <span className="live-dot" />
          <span className="live-label">LIVE</span>
        </div>

        {/* Lang */}
        <button onClick={toggle} className="btn-lang">
          <Globe width={11} height={11} />
          {t.switchLang}
        </button>

        {/* Hamburger */}
        <button className="btn-menu md:hidden" onClick={() => setOpen(v => !v)}
          aria-label="menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Category ribbon */}
      {categories.length > 0 && (
        <div className="header-ribbon">
          <div className="ribbon-inner" style={{ maxWidth: 1440, margin: '0 auto' }}>
            <Link href="/news"
              className={'ribbon-link' + (pathname === '/news' ? ' active' : '')}>
              {t.allNews}
            </Link>
            {categories.slice(0, 10).map(cat => {
              const href = `/category/${cat.slug || cat.id}`;
              return (
                <Link key={cat.id} href={href}
                  className={'ribbon-link' + (pathname === href ? ' active' : '')}
                  style={pathname === href ? { borderBottomColor: cat.color || 'var(--gold-l)' } : {}}>
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {open && (
        <div className="mobile-menu md:hidden">
          {[
            { href: '/',     label: t.nav.home },
            { href: '/news', label: t.nav.news },
          ].map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className={'mobile-nav-link' + (isActive(href) ? ' active' : '')}>
              {label}
            </Link>
          ))}
          {categories.length > 0 && (
            <div style={{ paddingTop: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,.07)' }}>
              {categories.slice(0, 8).map(cat => (
                <Link key={cat.id} href={`/category/${cat.slug || cat.id}`}
                  onClick={() => setOpen(false)}
                  className="mobile-cat-link">
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
