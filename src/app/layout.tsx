import type { Metadata } from 'next';
import './globals.css';
import { TopLoader } from '@/components/TopLoader';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LangProvider } from '@/context/LangContext';
import { BackToTop } from '@/components/BackToTop';
import { getAllCategories } from '@/lib/api';

export const metadata: Metadata = {
  title: 'اخبار تجارت | پورتال خبری اقتصاد و بازرگانی',
  description: 'جامع‌ترین پوشش اخبار تجارت، اقتصاد، بازارهای مالی و کسب‌وکار',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getAllCategories();
  const hasCats = categories.length > 0;

  return (
    <html lang="fa" dir="rtl">
      <body>
        <LangProvider>
          <TopLoader />
          <Header categories={categories} />
          {/* pt accounts for fixed header: 56px main + 36px ribbon = 92px */}
          <main className="min-h-screen" style={{ paddingTop: hasCats ? '95px' : '59px' }}>
            {children}
          </main>
          <Footer categories={categories} />
          <BackToTop />
        </LangProvider>
      </body>
    </html>
  );
}
