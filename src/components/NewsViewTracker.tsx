'use client';

import { useEffect } from 'react';

export function NewsViewTracker({ id }: { id: string }) {
  useEffect(() => {
    fetch(`/api/news/${id}/view`, { method: 'POST' }).catch(() => {});
  }, [id]);

  return null;
}
