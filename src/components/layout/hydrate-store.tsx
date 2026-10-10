'use client';

import { useEffect } from 'react';
import { useLifeStore } from '@/store/use-store';

export default function HydrateStore({ children }: { children: React.ReactNode }) {
  const hydrate = useLifeStore(s => s.hydrate);
  const hydrated = useLifeStore(s => s.hydrated);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  return <>{children}</>;
}
