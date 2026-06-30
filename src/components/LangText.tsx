'use client';

import { useLang } from '@/context/LangContext';

interface Props {
  fa: string;
  en: string;
}

export function LangText({ fa, en }: Props) {
  const { locale } = useLang();
  return <>{locale === 'fa' ? fa : en}</>;
}
