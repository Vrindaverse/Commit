'use client';

import { motion } from 'framer-motion';
import { ArrowRight, HandCoins, PiggyBank, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import { Button } from '@/components/ui/button';
import { formatMoneyShort } from '@/lib/currency';
import type { FinanceSummary } from '@/lib/dashboard-stats';

interface FinanceCardProps {
  finance: FinanceSummary;
  monthLabel: string;
  currency: string;
  onOpen: () => void;
}

export default function FinanceCard({ finance, monthLabel, currency, onOpen }: FinanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: 0.1, ease: 'easeOut' }}
    >
      <NeoCard color="#F7E8A4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#F7E8A4] flex items-center justify-center"><Wallet size={18} /></div>
            <h2 className="text-lg font-extrabold">Finance · {monthLabel}</h2>
          </div>
          <Button onClick={onOpen} variant="outline" size="xs" className="text-muted-foreground flex items-center gap-1 min-h-[44px] sm:min-h-6">
            Open Finance <ArrowRight size={12} />
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 tint-green">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1"><TrendingUp size={12} /> Earnings</p>
            <p className="text-xl font-extrabold mt-1">{formatMoneyShort(finance.earnings, currency)}</p>
          </div>
          <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 tint-pink">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1"><TrendingDown size={12} /> Expenses</p>
            <p className="text-xl font-extrabold mt-1">{formatMoneyShort(finance.expenses, currency)}</p>
          </div>
          <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 tint-yellow">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1"><PiggyBank size={12} /> Savings</p>
            <p className={`text-xl font-extrabold mt-1 ${finance.savings >= 0 ? 'text-[#4C8C4A]' : 'text-[#B85042]'}`}>
              {formatMoneyShort(finance.savings, currency)}
              <span className="text-xs font-bold text-[#5C5C5C]"> · {finance.rate}%</span>
            </p>
          </div>
          <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 tint-blue">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5C5C5C] flex items-center gap-1"><HandCoins size={12} /> Loans</p>
            <p className={`text-xl font-extrabold mt-1 ${finance.loanNet >= 0 ? 'text-[#4C8C4A]' : 'text-[#B85042]'}`}>
              {formatMoneyShort(finance.loanNet, currency)}
            </p>
          </div>
        </div>
      </NeoCard>
    </motion.div>
  );
}
