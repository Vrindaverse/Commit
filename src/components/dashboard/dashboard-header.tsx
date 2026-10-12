'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { MotivationalQuote } from '@/lib/motivationalQuotes';

interface DashboardHeaderProps {
  greeting: string;
  todayLabel: string;
  quote: MotivationalQuote | null;
}

export default function DashboardHeader({ greeting, todayLabel, quote }: DashboardHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3"
    >
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2A2A2A]">{greeting}</h1>
        <p className="text-[#5C5C5C] font-medium mt-0.5">{todayLabel}</p>
      </div>
      {quote && (
        <div className="flex items-start gap-3 p-3 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] max-w-sm">
          <Sparkles size={16} className="text-[#F7E8A4] flex-shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-[#5C5C5C] italic leading-relaxed">
            &ldquo;{quote.text}&rdquo; <span className="not-italic font-bold">— {quote.author}</span>
          </p>
        </div>
      )}
    </motion.div>
  );
}
