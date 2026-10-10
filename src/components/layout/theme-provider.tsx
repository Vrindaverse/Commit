'use client';

import { useEffect } from 'react';
import { useLifeStore } from '@/store/use-store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const accentColor = useLifeStore(s => s.settings.accentColor);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor);
  }, [accentColor]);

  return <>{children}</>;
}
