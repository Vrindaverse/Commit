'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Target, CheckSquare, Flame, NotebookPen,
  Rocket, BookOpen, GraduationCap, Trophy, BarChart3, Settings, Wallet,
} from 'lucide-react';
import './dock.css';

const ITEMS = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/habits', label: 'Habits', icon: Flame },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/expenses', label: 'Finance', icon: Wallet },
  { href: '/journal', label: 'Journal', icon: NotebookPen },
  { href: '/projects', label: 'Projects', icon: Rocket },
  { href: '/learning', label: 'Learning', icon: BookOpen },
  { href: '/academics', label: 'Academics', icon: GraduationCap },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Dock() {
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = activeRef.current;
    const container = scrollRef.current;
    if (!el || !container) return;
    const target = el.offsetLeft - (container.clientWidth - el.clientWidth) / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [pathname]);

  const activeIndex = ITEMS.findIndex(item => item.href === pathname);

  return (
    <nav
      aria-label="Sections"
      className="dock-nav md:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center"
    >
      <span className="sr-only" aria-live="polite">
        {activeIndex >= 0 ? `${ITEMS[activeIndex].label} section` : 'Navigation'}
      </span>
      <div className="dock-panel">
        <div className="dock-scroll" ref={scrollRef}>
          <div className="dock-track">
            {ITEMS.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <button
                  key={item.href}
                  ref={active ? activeRef : undefined}
                  onClick={() => router.push(item.href)}
                  className={`dock-item ${active ? 'dock-item--active' : ''}`}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  title={item.label}
                >
                  <span className="dock-item-icon">
                    <Icon size={16} />
                  </span>
                  <span className="dock-item-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
