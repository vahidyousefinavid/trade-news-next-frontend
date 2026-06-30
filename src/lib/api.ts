const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

function normalizeImage(image: string | null): string | null {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return BASE + image;
}

function normalizeNews(n: News): News {
  return { ...n, image: normalizeImage(n.image) };
}

export interface News {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string;
  image: string | null;
  status: 'published' | 'draft';
  isFeatured: boolean;
  isBreaking: boolean;
  views: number;
  source: string | null;
  publishedAt: string | null;
  createdAt: string;
  tags: string[] | null;
  category: { id: string; name: string; color: string | null } | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
}

export async function getAllNews(params?: { status?: string; categoryId?: string; featured?: string }): Promise<News[]> {
  const qs = new URLSearchParams(params as any).toString();
  const res = await fetch(`${BASE}/api/news${qs ? '?' + qs : ''}`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data: News[] = await res.json();
  return data.map(normalizeNews);
}

export async function getNewsById(id: string): Promise<News | null> {
  const res = await fetch(`${BASE}/api/news/${id}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  const data: News = await res.json();
  return normalizeNews(data);
}

export async function getAllCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/api/categories`, { next: { revalidate: 300 } });
  if (!res.ok) return [];
  return res.json();
}

export function trackView(id: string) {
  fetch(`/api/news/${id}/view`, { method: 'POST' }).catch(() => {});
}
