'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { dict, type Locale, type T } from '@/i18n';

interface LangCtx {
  locale: Locale;
  t: T;
  toggle: () => void;
}

const LangContext = createContext<LangCtx>({ locale: 'fa', t: dict.fa, toggle: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fa');

  useEffect(() => {
    const saved = localStorage.getItem('tn-lang') as Locale;
    if (saved === 'fa' || saved === 'en') setLocale(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('dir', dict[locale].dir);
    document.documentElement.setAttribute('lang', locale);
  }, [locale]);

  const toggle = () => {
    const next: Locale = locale === 'fa' ? 'en' : 'fa';
    setLocale(next);
    localStorage.setItem('tn-lang', next);
  };

  return (
    <LangContext.Provider value={{ locale, t: dict[locale] as T, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
