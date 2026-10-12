'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

type ToastKind = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function remove(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function add(kind: ToastKind, message: string, duration = 3500) {
  const id = nextId++;
  toasts = [...toasts, { id, kind, message }];
  emit();
  if (typeof window !== 'undefined') {
    window.setTimeout(() => remove(id), duration);
  }
}

function friendly(message: string): string {
  const statusMatch = message.match(/API error:\s*(\d+)/);
  if (statusMatch) {
    const status = statusMatch[1];
    if (status === '401') return 'Your session expired. Please sign in again.';
    if (status === '403') return "You don't have permission to do that.";
    if (status === '404') return 'That item could not be found.';
    if (status.startsWith('5')) return 'The server had a problem. Please try again.';
    return 'Something went wrong. Please try again.';
  }
  if (/failed to fetch|networkerror|load failed|network request failed/i.test(message)) {
    return 'Network error. Check your connection and try again.';
  }
  return message || 'Something went wrong. Please try again.';
}

export const toast = {
  success: (message: string) => add('success', message),
  error: (message: string) => add('error', friendly(message)),
  info: (message: string) => add('info', message),
};

const kindStyles: Record<ToastKind, { tint: string; icon: React.ReactNode }> = {
  success: { tint: '#CDEAC0', icon: <CheckCircle2 size={16} /> },
  error: { tint: '#F8C8C8', icon: <AlertTriangle size={16} /> },
  info: { tint: '#B8D8F8', icon: <Info size={16} /> },
};

export default function Toaster() {
  const list = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => toasts,
    () => toasts,
  );

  useEffect(() => {
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      toast.error(reason instanceof Error ? reason.message : 'Something went wrong. Please try again.');
    };
    window.addEventListener('unhandledrejection', onRejection);
    return () => window.removeEventListener('unhandledrejection', onRejection);
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[120] flex flex-col items-center gap-2 px-4 md:bottom-6 md:right-6 md:left-auto md:items-end"
    >
      <AnimatePresence initial={false}>
        {list.map((t) => {
          const style = kindStyles[t.kind];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              role="status"
              className="pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] p-3 shadow-[4px_4px_0px_0px_var(--neo-shadow)]"
            >
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-[2px] border-[#2D2D2D]"
                style={{ backgroundColor: style.tint }}
              >
                {style.icon}
              </div>
              <p className="flex-1 pt-0.5 text-xs font-bold leading-snug text-[#2A2A2A]">{t.message}</p>
              <button
                type="button"
                onClick={() => remove(t.id)}
                aria-label="Dismiss notification"
                className="shrink-0 rounded-md p-0.5 text-[#5C5C5C] transition-colors hover:text-[#2A2A2A]"
              >
                <X size={13} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
