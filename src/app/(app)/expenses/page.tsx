'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, Plus, X, Search, Pencil, TrendingUp, TrendingDown,
  Utensils, Car, ShoppingBag, Receipt, Film, HeartPulse, GraduationCap, Package,
  Briefcase, Laptop, Gift, RotateCcw, Banknote, Landmark, CreditCard, Smartphone,
  ArrowUpRight, ArrowDownRight, Download, PiggyBank, Repeat, SlidersHorizontal,
  ChevronLeft, ChevronRight, CalendarDays, HandCoins, Check, Scale, Trophy, Target, Sparkles,
  Loader2, Trash2,
} from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import PageHeader from '@/components/shared/page-header';
import { useLifeStore, genId } from '@/store/use-store';
import type { Expense, ExpenseCategory, TransactionType, Account, BudgetMap, Loan, LoanKind } from '@/types';
import {
  format, subMonths, addMonths, subWeeks, addWeeks, subDays, addDays, parse,
  getDaysInMonth, getDay, isSameMonth, startOfWeek, endOfWeek, startOfMonth, endOfMonth,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from '@/components/ui/dialog';

const CURRENCY = '₹';

const money = (v: string | number) =>
  CURRENCY +
  Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const moneyShort = (v: string | number) => {
  const n = Number(v);
  const sign = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (a >= 10000000) return `${sign}${CURRENCY}${(a / 10000000).toFixed(2)}Cr`;
  if (a >= 100000) return `${sign}${CURRENCY}${(a / 100000).toFixed(2)}L`;
  if (a >= 1000) return `${sign}${CURRENCY}${(a / 1000).toFixed(1)}k`;
  return `${sign}${CURRENCY}${a.toFixed(0)}`;
};

const CATEGORY_META: Record<ExpenseCategory, { label: string; color: string; icon: React.ReactNode; kind: 'expense' | 'income' | 'both' }> = {
   food: { label: 'Food', color: '#FFD8BE', icon: <Utensils size={16} />, kind: 'expense' },
   transport: { label: 'Transport', color: '#B8D8F8', icon: <Car size={16} />, kind: 'expense' },
   shopping: { label: 'Shopping', color: '#DCCEF5', icon: <ShoppingBag size={16} />, kind: 'expense' },
   bills: { label: 'Bills', color: '#F8C8C8', icon: <Receipt size={16} />, kind: 'expense' },
   entertainment: { label: 'Fun', color: '#F7E8A4', icon: <Film size={16} />, kind: 'expense' },
   health: { label: 'Health', color: '#CDEAC0', icon: <HeartPulse size={16} />, kind: 'expense' },
   education: { label: 'Education', color: '#BFE3E0', icon: <GraduationCap size={16} />, kind: 'expense' },
   salary: { label: 'Salary', color: '#CDEAC0', icon: <Briefcase size={16} />, kind: 'income' },
   freelance: { label: 'Freelance', color: '#BFE3E0', icon: <Laptop size={16} />, kind: 'income' },
   investment: { label: 'Investment', color: '#B8D8F8', icon: <TrendingUp size={16} />, kind: 'income' },
   gift: { label: 'Gift', color: '#F7E8A4', icon: <Gift size={16} />, kind: 'income' },
   refund: { label: 'Refund', color: '#DCCEF5', icon: <RotateCcw size={16} />, kind: 'income' },
   other: { label: 'Other', color: '#E4DED4', icon: <Package size={16} />, kind: 'both' },
};

const EXPENSE_CATS: ExpenseCategory[] = ['food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'education', 'other'];
const INCOME_CATS: ExpenseCategory[] = ['salary', 'freelance', 'investment', 'gift', 'refund', 'other'];

const ACCOUNT_META: Record<Account, { label: string; color: string; icon: React.ReactNode }> = {
   cash: { label: 'Cash', color: '#CDEAC0', icon: <Banknote size={14} /> },
   bank: { label: 'Bank', color: '#B8D8F8', icon: <Landmark size={14} /> },
   card: { label: 'Card', color: '#DCCEF5', icon: <CreditCard size={14} /> },
   upi: { label: 'UPI', color: '#F7E8A4', icon: <Smartphone size={14} /> },
   other: { label: 'Other', color: '#E4DED4', icon: <Wallet size={14} /> },
};

const ACCOUNTS: Account[] = ['cash', 'bank', 'card', 'upi', 'other'];

const LOAN_META: Record<LoanKind, { label: string; color: string; icon: React.ReactNode }> = {
   borrowed: { label: 'Borrowed', color: '#F8C8C8', icon: <ArrowDownRight size={14} /> },
   lent: { label: 'Lent', color: '#CDEAC0', icon: <ArrowUpRight size={14} /> },
};

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const HEAT_COLORS = ['#F0ECE4', '#CDEAC0', '#F7E8A4', '#FFD8BE', '#F8C8C8'];

// Solid, single-border action buttons with a hard offset shadow.
const ACTION_BTN =
  'px-4 py-3 text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap min-h-[48px] rounded-[15px] border-[2.5px] border-[#303030] text-[#2A2A2A] transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none';

// Consistent compact close (X) button used across all popups.
const CLOSE_BTN =
  'p-2 rounded-xl border-[2.5px] border-[#303030] bg-[#FFFDF8] text-[#5C5C5C] hover:text-[#2A2A2A] hover:bg-[#F0ECE4] flex items-center justify-center min-h-[44px] min-w-[44px] transition-all active:translate-y-0.5 active:shadow-none shadow-[3px_3px_0px_0px_var(--neo-shadow)]';

// Haptic feedback helper
const triggerHapticFeedback = () => {
   // Check if Vibration API is available and supported
   if ('vibrate' in navigator) {
      try {
         navigator.vibrate(10); // 10ms vibration
      } catch (e) {
         // Vibration API might not be available or permitted
         console.warn('Vibration API not available:', e);
      }
   }
};

type SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
type Period = 'daily' | 'weekly' | 'monthly';
type BudgetKey = ExpenseCategory | 'overall' | 'savings';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
];

const dayKey = (d: Date) => format(d, 'yyyy-MM-dd');

function rangeFor(period: Period, anchor: Date) {
  if (period === 'daily') {
    const key = dayKey(anchor);
    return { start: key, end: key, label: format(anchor, 'EEE, dd MMM yyyy') };
  }
  if (period === 'weekly') {
    const s = startOfWeek(anchor, { weekStartsOn: 1 });
    const e = endOfWeek(anchor, { weekStartsOn: 1 });
    return { start: dayKey(s), end: dayKey(e), label: `${format(s, 'dd MMM')} – ${format(e, 'dd MMM yyyy')}` };
  }
  const s = startOfMonth(anchor);
  const e = endOfMonth(anchor);
  return { start: dayKey(s), end: dayKey(e), label: format(anchor, 'MMMM yyyy') };
}

function shiftAnchor(period: Period, anchor: Date, dir: number) {
  if (period === 'daily') return addDays(anchor, dir);
  if (period === 'weekly') return addWeeks(anchor, dir);
  return addMonths(anchor, dir);
}

const inRange = (date: string, start: string, end: string) => date >= start && date <= end;

function SectionTitle({ icon, title, action }: { icon: React.ReactNode; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-extrabold flex items-center gap-2">
        <span className="w-7 h-7 rounded-lg border-[2px] border-[#2D2D2D] bg-[#F0ECE4] flex items-center justify-center">{icon}</span>
        {title}
      </h3>
      {action}
    </div>
  );
}

function TransactionForm({
  initial,
  defaultDate,
  onSubmit,
  onCancel,
  isLoading,
  setIsLoading,
}: {
  initial?: Expense;
  defaultDate?: string;
  onSubmit: (expense: Expense) => void;
  onCancel: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? 'expense');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [category, setCategory] = useState<ExpenseCategory>(
    initial?.category ?? (type === 'income' ? 'salary' : 'food')
  );
  const [account, setAccount] = useState<Account>(initial?.account ?? 'bank');
  const [date, setDate] = useState(initial?.date ?? defaultDate ?? format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [recurring, setRecurring] = useState(initial?.recurring ?? false);
  const [titleError, setTitleError] = useState<string>('');
  const [amountError, setAmountError] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');

  const validate = () => {
    let valid = true;
    let newTitleError = '';
    let newAmountError = '';
    let newDateError = '';

    if (!title.trim()) {
      newTitleError = 'Title is required';
      valid = false;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      newAmountError = 'Please enter a valid amount greater than 0';
      valid = false;
    }

    if (!date) {
      newDateError = 'Date is required';
      valid = false;
    } else {
      // Basic date validation (could be more robust)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        newDateError = 'Invalid date format';
        valid = false;
      }
    }

    setTitleError(newTitleError);
    setAmountError(newAmountError);
    setDateError(newDateError);

    return valid;
  };

  const cats = type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  const switchType = (next: TransactionType) => {
    setType(next);
    if (!(next === 'income' ? INCOME_CATS : EXPENSE_CATS).includes(category)) {
      setCategory(next === 'income' ? 'salary' : 'food');
    }
  };

   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     if (!validate()) {
       return;
     }
     setIsLoading(true);
     try {
       const parsed = Number(amount);
       onSubmit({
         id: initial?.id ?? genId(),
         title: title.trim(),
         amount: parsed.toFixed(2),
         type,
         category,
         account,
         date,
         notes: notes.trim(),
         recurring,
       });
     } finally {
       setIsLoading(false);
       onCancel();
     }
   };

return (
    <form onSubmit={handleSubmit} className="neo-card tint-peach flex max-h-[88vh] w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b-[2.5px] border-[#2D2D2D] px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold truncate">{initial ? 'Edit Transaction' : 'New Transaction'}</h2>
          <p className="text-[11px] font-bold text-[#5C5C5C]">{initial ? 'Update the details below' : 'Log a new income or expense'}</p>
        </div>
        <button
          type="button"
          aria-label="Close transaction form"
          onClick={() => {
            triggerHapticFeedback();
            setIsLoading(false);
            onCancel();
          }}
          className={`${CLOSE_BTN} shrink-0`}
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
      <div className="inline-flex rounded-xl border-[3px] border-[#2D2D2D] overflow-hidden mb-4 w-full">
        {(['expense', 'income'] as TransactionType[]).map((t) => (
          <Button
            key={t}
            variant="default"
            size="xs"
            onClick={() => switchType(t)}
            className={`flex-1 px-4 py-3 text-sm font-extrabold capitalize transition-colors min-h-[48px] ${
              type === t
                ? t === 'income'
                  ? 'bg-[#CDEAC0] text-[#2A2A2A]'
                  : 'bg-[#F8C8C8] text-[#2A2A2A]'
                : 'bg-[#FFFDF8] text-[#5C5C5C]'}
            `}
          >
            {t === 'income' ? 'Income' : 'Expense'}
          </Button>
        ))}
      </div>

      <div className="mb-4">
        <label className="text-xs font-bold text-[#5C5C5C] block mb-2">Category</label>
        <div className="flex gap-2 flex-wrap">
          {cats.map((key) => {
            const c = CATEGORY_META[key];
            return (
              <Button
                key={key}
                variant="default"
                size="xs"
                onClick={() => setCategory(key)}
                className={`flex items-center gap-1.5 text-xs font-bold text-[#2A2A2A] px-3 py-3 rounded-xl border-[3px] border-[#2D2D2D] transition-all min-h-[44px] ${
                  category === key ? 'shadow-[3px_3px_0px_0px_var(--neo-shadow)]' : 'opacity-90 hover:opacity-100'
                }`}
                style={{ backgroundColor: category === key ? c.color : '#FFFDF8' }}
              >
                {c.icon}
                {c.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
           <div className="min-w-0">
             <label className="text-xs font-bold text-[#5C5C5C] block mb-1.5">Title</label>
             <input
               value={title}
               onChange={(e) => {
                 setTitle(e.target.value);
                 validate();
               }}
               placeholder={type === 'income' ? 'Where did it come from?' : 'What did you spend on?'}
               className="neo-input w-full text-sm font-bold min-h-[48px]"
               required
               autoFocus
             />
             {titleError && <span className="text-xs block mt-1" style={{ color: '#EF4444' }}>{titleError}</span>}
           </div>
           <div className="min-w-0">
             <label className="text-xs font-bold text-[#5C5C5C] block mb-1.5">Amount</label>
             <input
               type="number"
               inputMode="decimal"
               min="0"
               step="0.01"
               value={amount}
               onChange={(e) => {
                 setAmount(e.target.value);
                 validate();
               }}
               placeholder="0.00"
               className="neo-input w-full text-sm font-bold min-h-[48px]"
               required
             />
             {amountError && <span className="text-xs block mt-1" style={{ color: '#EF4444' }}>{amountError}</span>}
           </div>
        </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
           <div className="min-w-0">
             <label className="text-xs font-bold text-[#5C5C5C] block mb-1.5">Date</label>
             <input
               type="date"
               value={date}
               onChange={(e) => {
                 setDate(e.target.value);
                 validate();
               }}
               className="neo-input text-sm font-bold w-full min-h-[48px]"
               required
             />
             {dateError && <span className="text-xs block mt-1" style={{ color: '#EF4444' }}>{dateError}</span>}
           </div>
           <div className="min-w-0">
             <label className="text-xs font-bold text-[#5C5C5C] block mb-1.5">Account</label>
             <div className="w-full">
              <Select
                value={account}
                onValueChange={(value) => setAccount(value as Account)}
              >
                {ACCOUNTS.map((a) => (
                  <SelectItem key={a} value={a}>{ACCOUNT_META[a].label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
          className="neo-input w-full text-sm resize-none min-h-[60px]"
        />

        <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
          <input
            type="checkbox"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="w-4 h-4 accent-[#2D2D2D]"
          />
          <span className="text-xs font-bold text-[#5C5C5C] flex items-center gap-1">
            <Repeat size={13} /> Recurring
          </span>
        </label>

         <Button
           type="submit"
           variant="default"
           size="default"
           className={`px-6 py-3 text-sm w-full min-h-[48px] ${type === 'income' ? 'bg-[#CDEAC0] tint-green' : 'bg-[#F7E8A4] tint-yellow'}`}
           disabled={isLoading}
           onClick={triggerHapticFeedback}
         >
           {isLoading ? (
             <>
               <Loader2 size={16} className="mr-2 animate-spin-slow" />
               Adding...
             </>
           ) : (
             initial ? 'Save Changes' : type === 'income' ? 'Add Income' : 'Add Expense'
           )}
         </Button>
      </div>
      </div>
    </form>
  );
}

function BudgetEditor({
  budgets,
  onChange,
  onClose,
}: {
  budgets: BudgetMap;
  onChange: (key: BudgetKey, value: number) => void;
  onClose: () => void;
}) {
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  const handleChange = (key: BudgetKey, value: string) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
    const num = value === '' ? 0 : Number(value);
    if (!Number.isNaN(num)) {
      onChange(key, num);
    }
  };

  const getValue = (key: BudgetKey) => {
    if (localValues[key] !== undefined) return localValues[key];
    const v = budgets[key];
    return v !== undefined && v !== null ? String(v) : '';
  };

  return (
    <div className="neo-card tint-blue flex max-h-[88vh] w-full flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b-[2.5px] border-[#2D2D2D] px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold truncate">Budgets &amp; Savings</h2>
          <p className="text-[11px] font-bold text-[#5C5C5C]">Set monthly limits per category</p>
        </div>
        <button type="button" aria-label="Close budgets" onClick={onClose} className={`${CLOSE_BTN} shrink-0`}>
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-xs font-bold text-[#5C5C5C] block mb-1.5">Overall monthly budget</label>
          <input
            type="number"
            min="0"
            step="1"
            value={getValue('overall')}
            onChange={(e) => handleChange('overall', e.target.value)}
            onBlur={(e) => {
              const num = Number(e.target.value);
              if (Number.isNaN(num) || num <= 0) {
                setLocalValues((prev) => { const n = { ...prev }; delete n.overall; return n; });
              }
            }}
            placeholder="e.g. 30000"
            className="neo-input text-sm font-bold w-full"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#5C5C5C] block mb-1.5">Monthly savings goal</label>
          <input
            type="number"
            min="0"
            step="1"
            value={getValue('savings')}
            onChange={(e) => handleChange('savings', e.target.value)}
            onBlur={(e) => {
              const num = Number(e.target.value);
              if (Number.isNaN(num) || num <= 0) {
                setLocalValues((prev) => { const n = { ...prev }; delete n.savings; return n; });
              }
            }}
            placeholder="e.g. 10000"
            className="neo-input text-sm font-bold w-full"
          />
        </div>
      </div>

      <p className="text-xs font-bold text-[#5C5C5C] mb-2">Per category</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EXPENSE_CATS.filter((c) => c !== 'other').map((key) => {
          const c = CATEGORY_META[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className="w-8 h-8 shrink-0 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center"
                style={{ backgroundColor: c.color }}
              >
                {c.icon}
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={getValue(key)}
                onChange={(e) => handleChange(key, e.target.value)}
                onBlur={(e) => {
                  const num = Number(e.target.value);
                  if (Number.isNaN(num) || num <= 0) {
                    setLocalValues((prev) => { const n = { ...prev }; delete n[key]; return n; });
                  }
                }}
                placeholder={c.label}
                className="neo-input text-sm font-bold w-full"
              />
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

function LoanForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: Loan;
  onSubmit: (loan: Loan) => void;
  onCancel: () => void;
}) {
  const [kind, setKind] = useState<LoanKind>(initial?.kind ?? 'borrowed');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [counterparty, setCounterparty] = useState(initial?.counterparty ?? '');
  const [principal, setPrincipal] = useState(initial ? String(initial.principal) : '');
  const [paid, setPaid] = useState(initial ? String(initial.paid) : '');
  const [date, setDate] = useState(initial?.date ?? format(new Date(), 'yyyy-MM-dd'));
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = Number(principal);
    if (!title.trim() || !Number.isFinite(p) || p <= 0) return;
    const paidNum = Number(paid);
    onSubmit({
      id: initial?.id ?? genId(),
      title: title.trim(),
      counterparty: counterparty.trim(),
      kind,
      principal: p.toFixed(2),
      paid: (Number.isFinite(paidNum) && paidNum > 0 ? paidNum : 0).toFixed(2),
      date,
      dueDate,
      notes: notes.trim(),
      settled: initial?.settled ?? false,
    });
    onCancel();
  };

return (
    <form onSubmit={handleSubmit} className="rounded-2xl border-[2.5px] border-[#2D2D2D] bg-[#FFFDF8] p-4 tint-teal sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-base font-extrabold">{initial ? 'Edit Loan' : 'New Loan'}</h2>
        <button type="button" aria-label="Close loan form" onClick={() => {
    triggerHapticFeedback();
    onCancel();
  }} className={`${CLOSE_BTN} shrink-0`}>
          <X size={16} />
        </button>
      </div>

      <div className="inline-flex rounded-xl border-[3px] border-[#2D2D2D] overflow-hidden mb-4 w-full">
        {(['borrowed', 'lent'] as LoanKind[]).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setKind(k)}
            className={`flex-1 px-4 py-3 text-sm font-extrabold capitalize transition-colors min-h-[48px] ${
              kind === k ? (k === 'borrowed' ? 'bg-[#F8C8C8] text-[#2A2A2A]' : 'bg-[#CDEAC0] text-[#2A2A2A]') : 'bg-[#FFFDF8] text-[#5C5C5C]'
            }`}
          >
            {k === 'borrowed' ? 'I borrowed' : 'I lent'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={kind === 'borrowed' ? 'What did you borrow for?' : 'What did you lend for?'}
            className="neo-input flex-1 text-sm font-bold min-h-[48px]"
            required
            autoFocus
          />
          <input
            value={counterparty}
            onChange={(e) => setCounterparty(e.target.value)}
            placeholder={kind === 'borrowed' ? 'Lender' : 'Borrower'}
            className="neo-input w-full text-sm font-bold min-h-[48px]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.00"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder={kind === 'borrowed' ? 'Amount borrowed' : 'Amount lent'}
            className="neo-input flex-1 text-sm font-bold min-h-[48px]"
            required
          />
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.00"
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            placeholder={kind === 'borrowed' ? 'Repaid so far' : 'Recovered so far'}
            className="neo-input flex-1 text-sm font-bold min-h-[48px]"
          />
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="neo-input text-sm font-bold w-full min-h-[48px]"
            required
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="neo-input text-sm font-bold w-full min-h-[48px]"
          />
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
          className="neo-input w-full text-sm resize-none min-h-[60px]"
        />

        <button type="submit" className={`neo-button px-6 py-3 text-sm w-full min-h-[48px] ${kind === 'borrowed' ? 'bg-[#F8C8C8] tint-pink' : 'bg-[#CDEAC0] tint-green'}`} onClick={triggerHapticFeedback}>
          {initial ? 'Save Loan' : 'Add Loan'}
        </button>
      </div>
    </form>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
  icon,
  trend,
  tint,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: React.ReactNode;
  trend?: number | null;
  tint?: string;
}) {
  return (
    <div className={`neo-card p-5 ${tint ?? ''}`}>
      <div className="flex items-center justify-between mb-2 gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#5C5C5C] truncate">{label}</p>
        <div
          className="w-8 h-8 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center shrink-0"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
      </div>
      <p className="text-2xl font-extrabold text-[#2A2A2A] tabular-nums truncate">{value}</p>
      <div className="flex items-center gap-2 mt-0.5 min-w-0">
        {sub ? <p className="text-[11px] font-bold text-[#5C5C5C] truncate">{sub}</p> : null}
        {typeof trend === 'number' ? (
          <span
            className={`text-[11px] font-extrabold flex items-center gap-0.5 ${
              trend > 0 ? 'text-[#B85042]' : 'text-[#4C8C4A]'
            }`}
          >
            {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(trend)}%
          </span>
        ) : null}
      </div>
    </div>
  );
}

function PeriodHero({
  kicker,
  dateLabel,
  income,
  expense,
  net,
  rate,
  delta,
  bg,
  accent,
  tint,
  children,
}: {
  kicker: string;
  dateLabel: string;
  income: number;
  expense: number;
  net: number;
  rate: number;
  delta: number | null;
  bg: string;
  accent: string;
  tint: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[19px] border-[3px] border-[#2D2D2D] p-6 shadow-[6px_6px_0px_0px_var(--neo-shadow)] ${tint}`}
      style={{ backgroundColor: bg }}
    >
      <div className="pointer-events-none absolute -top-14 -right-12 w-44 h-44 rounded-full border-[3px] border-dashed opacity-70 animate-spin-slow" style={{ borderColor: accent }} />
      <div className="pointer-events-none absolute -bottom-8 -left-6 w-24 h-24 rounded-full opacity-50" style={{ backgroundColor: accent }} />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C5C5C] flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center" style={{ backgroundColor: accent }}>
              {net >= 0 ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
            </span>
            {kicker}
          </p>
          <p className="text-[11px] font-extrabold text-[#5C5C5C] text-right">{dateLabel}</p>
        </div>
        <p className={`text-4xl font-extrabold mt-2 ${net >= 0 ? 'text-[#4C8C4A]' : 'text-[#B85042]'}`}>
          {net >= 0 ? '+' : '-'}{money(Math.abs(net))}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[11px] font-extrabold">
          <span className="text-[#4C8C4A] flex items-center gap-1"><ArrowUpRight size={12} /> {moneyShort(income)} in</span>
          <span className="text-[#B85042] flex items-center gap-1"><ArrowDownRight size={12} /> {moneyShort(expense)} out</span>
          <span className="text-[#5C5C5C]">{rate}% saved</span>
          {typeof delta === 'number' && (
            <span className={`flex items-center gap-0.5 ${delta > 0 ? 'text-[#B85042]' : 'text-[#4C8C4A]'}`}>
              {delta > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(delta)}% vs previous
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  color,
  rows,
  max,
}: {
  title: string;
  color: string;
  rows: { key: ExpenseCategory; label: string; color: string; icon: React.ReactNode; total: number }[];
  max: number;
}) {
  return (
    <NeoCard color={color}>
      <SectionTitle icon={<TrendingUp size={15} />} title={title} />
      {rows.length === 0 ? (
        <p className="text-sm font-medium text-[#5C5C5C]">No spending logged in this period yet.</p>
      ) : (
        <div className="space-y-2.5">
          {rows.slice(0, 6).map((c) => (
            <div key={c.key} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center shrink-0"
                style={{ backgroundColor: c.color }}
              >
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold">{c.label}</span>
                  <span className="text-xs font-extrabold">{money(c.total)}</span>
                </div>
                <div className="h-2 rounded-full bg-[#F0ECE4] border-[2px] border-[#2D2D2D] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${max ? (c.total / max) * 100 : 0}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </NeoCard>
  );
}

export default function ExpensesPage() {
  const expenses = useLifeStore((s) => s.expenses);
  const addExpense = useLifeStore((s) => s.addExpense);
  const updateExpense = useLifeStore((s) => s.updateExpense);
  const deleteExpense = useLifeStore((s) => s.deleteExpense);
  const loans = useLifeStore((s) => s.loans);
  const addLoan = useLifeStore((s) => s.addLoan);
  const updateLoan = useLifeStore((s) => s.updateLoan);
  const deleteLoan = useLifeStore((s) => s.deleteLoan);
  const budgetsStored = useLifeStore((s) => s.settings.budgets);
  const budgets = useMemo(() => budgetsStored ?? {}, [budgetsStored]);
  const updateSettings = useLifeStore((s) => s.updateSettings);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [prefillDate, setPrefillDate] = useState<string | undefined>(undefined);
  const [showBudgets, setShowBudgets] = useState(false);
  const [showLoans, setShowLoans] = useState(false);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [period, setPeriod] = useState<Period>('monthly');
  const [anchor, setAnchor] = useState(() => new Date());
  const [calMonth, setCalMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | ''>('');
  const [sort, setSort] = useState<SortKey>('date-desc');

   // Loading state for form submission
    const [isAdding, setIsAdding] = useState(false);

    // Confirmation dialog for deletion
    const [deleteTarget, setDeleteTarget] = useState<{ kind: 'expense' | 'loan'; id: string; label: string } | null>(null);

   // Haptic feedback helper
   const triggerHapticFeedback = () => {
     // Check if Vibration API is available and supported
     if ('vibrate' in navigator) {
       try {
         navigator.vibrate(10); // 10ms vibration
       } catch (e) {
         // Vibration API might not be available or permitted
         console.warn('Vibration API not available:', e);
       }
     }
   };
 
  const range = useMemo(() => rangeFor(period, anchor), [period, anchor]);
  const prevRange = useMemo(
    () => rangeFor(period, shiftAnchor(period, anchor, -1)),
    [period, anchor]
  );

  const allTime = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of expenses) {
      const amt = Number(t.amount);
      if (t.type === 'income') income += amt;
      else expense += amt;
    }
    return { income, expense, balance: income - expense };
  }, [expenses]);

  const accounts = useMemo(
    () =>
      ACCOUNTS.map((a) => {
        let income = 0;
        let expense = 0;
        for (const t of expenses) {
          if (t.account !== a) continue;
          if (t.type === 'income') income += Number(t.amount);
          else expense += Number(t.amount);
        }
        return { key: a, ...ACCOUNT_META[a], balance: income - expense };
      }),
    [expenses]
  );

  const accountsByPeriod = useMemo(
    () =>
      ACCOUNTS.map((a) => {
        let income = 0;
        let expense = 0;
        for (const t of expenses) {
          if (t.account !== a || !inRange(t.date, range.start, range.end)) continue;
          if (t.type === 'income') income += Number(t.amount);
          else expense += Number(t.amount);
        }
        return { key: a, ...ACCOUNT_META[a], income, expense, balance: income - expense };
      }),
    [expenses, range]
  );

  const weekStrip = useMemo(() => {
    if (period !== 'weekly') return [];
    const start = parse(range.start, 'yyyy-MM-dd', new Date());
    const days: { date: string; dow: string; income: number; expense: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(start, i);
      const key = dayKey(d);
      let income = 0;
      let expense = 0;
      for (const t of expenses) {
        if (t.date !== key) continue;
        const amt = Number(t.amount);
        if (t.type === 'income') income += amt;
        else expense += amt;
      }
      days.push({ date: key, dow: format(d, 'EEEEE'), income, expense });
    }
    return days;
  }, [expenses, period, range]);

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    let prevExpense = 0;
    for (const t of expenses) {
      const amt = Number(t.amount);
      if (inRange(t.date, range.start, range.end)) {
        if (t.type === 'income') income += amt;
        else expense += amt;
      }
      if (t.type === 'expense' && inRange(t.date, prevRange.start, prevRange.end)) prevExpense += amt;
    }
    const savings = income - expense;
    const rate = income > 0 ? Math.round((savings / income) * 100) : 0;
    const delta = prevExpense > 0 ? Math.round(((expense - prevExpense) / prevExpense) * 100) : null;
    return { income, expense, savings, rate, delta };
  }, [expenses, range, prevRange]);

  const monthStats = useMemo(() => {
    const monthKey = format(anchor, 'yyyy-MM');
    const isCurrent = isSameMonth(anchor, new Date());
    const daysInMonth = getDaysInMonth(anchor);
    const daysElapsed = isCurrent ? new Date().getDate() : daysInMonth;
    let expense = 0;
    for (const t of expenses) {
      if (t.type === 'expense' && t.date.startsWith(monthKey)) expense += Number(t.amount);
    }
    const dailyAvg = daysElapsed > 0 ? expense / daysElapsed : 0;
    const projected = isCurrent ? dailyAvg * daysInMonth : expense;
    return { expense, isCurrent, dailyAvg, projected, daysInMonth };
  }, [expenses, anchor]);

  const loanStats = useMemo(() => {
    let borrowed = 0;
    let lent = 0;
    let borrowedPaid = 0;
    let lentRecovered = 0;
    for (const l of loans) {
      const p = Number(l.principal);
      const pd = Number(l.paid);
      if (l.kind === 'borrowed') {
        borrowed += p;
        borrowedPaid += pd;
      } else {
        lent += p;
        lentRecovered += pd;
      }
    }
    const borrowedOut = Math.max(0, borrowed - borrowedPaid);
    const lentOut = Math.max(0, lent - lentRecovered);
    return { borrowed, lent, borrowedOut, lentOut, net: lentOut - borrowedOut };
  }, [loans]);

  const trend = useMemo(() => {
    const buckets: { key: string; label: string; income: number; expense: number }[] = [];
    if (period === 'monthly') {
      for (let i = 5; i >= 0; i--) {
        const d = subMonths(anchor, i);
        const key = format(d, 'yyyy-MM');
        let income = 0;
        let expense = 0;
        for (const t of expenses) {
          if (!t.date.startsWith(key)) continue;
          const amt = Number(t.amount);
          if (t.type === 'income') income += amt;
          else expense += amt;
        }
        buckets.push({ key, label: format(d, 'MMM'), income, expense });
      }
    } else if (period === 'weekly') {
      for (let i = 5; i >= 0; i--) {
        const ws = startOfWeek(subWeeks(anchor, i), { weekStartsOn: 1 });
        const s = dayKey(ws);
        const e = dayKey(endOfWeek(ws, { weekStartsOn: 1 }));
        let income = 0;
        let expense = 0;
        for (const t of expenses) {
          if (!inRange(t.date, s, e)) continue;
          const amt = Number(t.amount);
          if (t.type === 'income') income += amt;
          else expense += amt;
        }
        buckets.push({ key: s, label: format(ws, 'dd MMM'), income, expense });
      }
    } else {
      for (let i = 6; i >= 0; i--) {
        const d = subDays(anchor, i);
        const key = dayKey(d);
        let income = 0;
        let expense = 0;
        for (const t of expenses) {
          if (t.date !== key) continue;
          const amt = Number(t.amount);
          if (t.type === 'income') income += amt;
          else expense += amt;
        }
        buckets.push({ key, label: format(d, 'EEEEE'), income, expense });
      }
    }
    return buckets;
  }, [expenses, anchor, period]);

  const trendMax = Math.max(1, ...trend.flatMap((m) => [m.income, m.expense]));

  const breakdown = useMemo(() => {
    const map = new Map<ExpenseCategory, number>();
    expenses
      .filter((t) => t.type === 'expense' && inRange(t.date, range.start, range.end))
      .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + Number(t.amount)));
    const list = Array.from(map.entries())
      .map(([key, total]) => ({ key, ...CATEGORY_META[key], total }))
      .sort((a, b) => b.total - a.total);
    const max = list[0]?.total ?? 0;
    return { list, max };
  }, [expenses, range]);

  const insights = useMemo(() => {
    const inPeriod = expenses.filter((t) => inRange(t.date, range.start, range.end));
    const spend = inPeriod.filter((t) => t.type === 'expense');
    const days = period === 'daily' ? 1 : period === 'weekly' ? 7 : getDaysInMonth(anchor);
    const largest = spend.reduce<Expense | null>(
      (m, t) => (!m || Number(t.amount) > Number(m.amount) ? t : m),
      null
    );
    const recurring = inPeriod.filter((t) => t.recurring).length;
    const topAccount = ACCOUNTS
      .map((a) => ({ a, total: spend.filter((t) => t.account === a).reduce((s, t) => s + Number(t.amount), 0) }))
      .sort((x, y) => y.total - x.total)[0];
    return {
      avgPerDay: summary.expense / days,
      largest,
      topCat: breakdown.list[0],
      recurring,
      txCount: inPeriod.length,
      topAccount: topAccount && topAccount.total > 0 ? { account: topAccount.a, ...ACCOUNT_META[topAccount.a], total: topAccount.total } : null,
    };
  }, [expenses, range, period, anchor, summary.expense, breakdown.list]);

  const calendar = useMemo(() => {
    const offset = getDay(startOfMonth(calMonth));
    const days = getDaysInMonth(calMonth);
    const monthKey = format(calMonth, 'yyyy-MM');
    const spend = new Map<number, number>();
    const income = new Map<number, number>();
    for (const t of expenses) {
      if (!t.date.startsWith(monthKey)) continue;
      const day = Number(t.date.slice(8, 10));
      const amt = Number(t.amount);
      if (t.type === 'income') income.set(day, (income.get(day) ?? 0) + amt);
      else spend.set(day, (spend.get(day) ?? 0) + amt);
    }
    const max = Math.max(1, ...Array.from(spend.values()));
    const today = dayKey(new Date());
    const cells: ({ day: number; spend: number; income: number; isToday: boolean } | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= days; d++) {
      cells.push({
        day: d,
        spend: spend.get(d) ?? 0,
        income: income.get(d) ?? 0,
        isToday: dayKey(new Date(calMonth.getFullYear(), calMonth.getMonth(), d)) === today,
      });
    }
    return { cells, max, monthKey };
  }, [expenses, calMonth]);

  const dayDetail = useMemo(() => {
    if (!selectedDay) return null;
    const items = expenses
      .filter((t) => t.date === selectedDay)
      .sort((a, b) => Number(b.amount) - Number(a.amount));
    let income = 0;
    let expense = 0;
    for (const t of items) {
      const amt = Number(t.amount);
      if (t.type === 'income') income += amt;
      else expense += amt;
    }
    return { items, income, expense, net: income - expense };
  }, [expenses, selectedDay]);

  const budgetRows = useMemo(() => {
    const monthKey = format(anchor, 'yyyy-MM');
    const rows = EXPENSE_CATS.filter((c) => (budgets[c] ?? 0) > 0).map((key) => {
      const spent = expenses
        .filter((t) => t.type === 'expense' && t.category === key && t.date.startsWith(monthKey))
        .reduce((s, t) => s + Number(t.amount), 0);
      const limit = budgets[key] ?? 0;
      return { key, ...CATEGORY_META[key], spent, limit, pct: limit ? Math.min(100, (spent / limit) * 100) : 0, over: spent > limit };
    });
    return rows.sort((a, b) => b.pct - a.pct);
  }, [expenses, budgets, anchor]);

  const overallBudget = budgets.overall ?? 0;
  const overallPct = overallBudget ? Math.min(100, (monthStats.expense / overallBudget) * 100) : 0;
  const savingsGoal = budgets.savings ?? 0;
  const periodSavingsPct = savingsGoal > 0 ? Math.min(100, Math.max(0, (summary.savings / savingsGoal) * 100)) : 0;

  const weeklyBudget = overallBudget > 0 ? overallBudget / 4.33 : 0;
  const weeklyPace = weeklyBudget > 0 ? Math.min(100, (summary.expense / weeklyBudget) * 100) : 0;
  const weekBusiest = (() => {
    if (period !== 'weekly') return null;
    let max: { date: string; dow: string; amount: number } | null = null;
    for (const d of weekStrip) {
      if (d.expense > 0 && (!max || d.expense > max.amount)) max = { date: d.date, dow: d.dow, amount: d.expense };
    }
    return max;
  })();

  const filtered = useMemo(() => {
    let result = expenses.filter((t) => inRange(t.date, range.start, range.end));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.notes.toLowerCase().includes(q)
      );
    }
    if (filterType !== 'all') result = result.filter((t) => t.type === filterType);
    if (filterCategory) result = result.filter((t) => t.category === filterCategory);

    return [...result].sort((a, b) => {
      switch (sort) {
        case 'date-asc': return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
        case 'amount-desc': return Number(b.amount) - Number(a.amount);
        case 'amount-asc': return Number(a.amount) - Number(b.amount);
        default: return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
      }
    });
  }, [expenses, range, searchQuery, filterType, filterCategory, sort]);

  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>();
    filtered.forEach((t) => {
      const list = map.get(t.date) ?? [];
      list.push(t);
      map.set(t.date, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const listSummary = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const t of filtered) {
      const amt = Number(t.amount);
      if (t.type === 'income') income += amt;
      else expense += amt;
    }
    return { count: filtered.length, income, expense, net: income - expense };
  }, [filtered]);

  const hasFilters = searchQuery !== '' || filterType !== 'all' || filterCategory !== '';

  const clearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterCategory('');
  };

  const shiftPeriod = (dir: number) => setAnchor((a) => shiftAnchor(period, a, dir));

  const setBudget = (key: BudgetKey, value: number) => {
    const next = { ...budgets };
    if (!value || value <= 0) delete next[key];
    else next[key] = value;
    updateSettings({ budgets: next });
  };

   const startAdd = (date?: string) => {
     if (showForm) {
       setShowForm(false);
       setEditing(null);
       setPrefillDate(undefined);
       setIsAdding(false);
     } else {
       setEditing(null);
       setPrefillDate(date);
       setShowBudgets(false);
       setShowLoans(false);
       setShowForm(true);
       setIsAdding(false);
     }
   };

  const exportCsv = () => {
    const rows = [['Date', 'Title', 'Type', 'Category', 'Account', 'Amount', 'Notes']];
    filtered.forEach((t) =>
      rows.push([
        t.date,
        t.title,
        t.type,
        CATEGORY_META[t.category].label,
        ACCOUNT_META[t.account].label,
        t.amount,
        t.notes.replace(/"/g, "'"),
      ])
    );
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${period}-${range.start}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <PageHeader
          title="Finance"
          description="Expenses, earnings, savings and loans — daily, weekly, monthly"
          icon={<Wallet size={20} />}
        />
          <div className="flex items-center gap-2 flex-wrap">
              <Dialog
                open={showLoans}
                onOpenChange={(open) => {
                  if (!open) {
                    setShowLoans(false);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticFeedback();
                      setShowLoans(true); setShowForm(false); setShowBudgets(false); }}
                    className={`${ACTION_BTN} bg-[#BFE3E0] shadow-[4px_4px_0px_0px_#93CFC9]`}
                  >
                    <HandCoins size={16} /> Loans
                  </button>
                </DialogTrigger>
<DialogContent
                  showCloseButton={false}
                  className="!max-w-[95vw] !bg-transparent !p-3 !ring-0 sm:!max-w-lg"
                >
                  <div className="neo-card tint-teal flex max-h-[85vh] w-full flex-col overflow-hidden">
                    <div className="flex items-center justify-between gap-3 border-b-[2.5px] border-[#2D2D2D] px-5 py-4">
                      <div className="min-w-0">
                        <h2 className="text-lg font-extrabold flex items-center gap-2">
                          <HandCoins size={18} /> Loans
                        </h2>
                        <p className="text-[11px] font-bold text-[#5C5C5C]">Track what you owe and what you&apos;re owed</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            triggerHapticFeedback();
                            setEditingLoan(null); setShowLoanForm((v) => !v); }}
                          className="neo-button px-3 py-2 text-xs bg-[#CDEAC0] tint-green flex items-center gap-1.5 min-h-[44px]"
                        >
                          <Plus size={15} /> {showLoanForm ? 'Cancel' : 'Add'}
                        </button>
                        <button
                          type="button"
                          aria-label="Close loans"
                          onClick={() => {
                            triggerHapticFeedback();
                            setShowLoans(false);
                          }}
                          className={CLOSE_BTN}
                        >
                          <X size={16} />
                        </button>
                      </div>
                     </div>
                     <div className="flex-1 overflow-y-auto px-5 py-4">
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                      <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 tint-pink">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C]">I owe</p>
                        <p className="text-lg font-extrabold text-[#B85042]">{money(loanStats.borrowedOut)}</p>
                        <p className="text-[10px] font-bold text-[#5C5C5C]">of {money(loanStats.borrowed)} borrowed</p>
                      </div>
                      <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 tint-green">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C]">Owed to me</p>
                        <p className="text-lg font-extrabold text-[#4C8C4A]">{money(loanStats.lentOut)}</p>
                        <p className="text-[10px] font-bold text-[#5C5C5C]">of {money(loanStats.lent)} lent</p>
                      </div>
                      <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 tint-blue">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C]">Net position</p>
                        <p className={`text-lg font-extrabold ${loanStats.net >= 0 ? 'text-[#4C8C4A]' : 'text-[#B85042]'}`}>
                          {money(loanStats.net)}
                        </p>
                        <p className="text-[10px] font-bold text-[#5C5C5C]">across {loans.length} loan{loans.length === 1 ? '' : 's'}</p>
                      </div>
                    </div>

{loans.length === 0 ? (
  <p className="text-sm font-medium text-[#5C5C5C]">
    No loans tracked. Add one to keep an eye on what you owe and what you&apos;re owed.
  </p>
) : (
  <div className="space-y-2">
    {loans.map((l) => {
      const meta = LOAN_META[l.kind];
      const principal = Number(l.principal);
      const paid = Number(l.paid);
      const outstanding = Math.max(0, principal - paid);
      const pct = principal > 0 ? Math.min(100, (paid / principal) * 100) : 0;
      return (
        <div key={l.id} className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl border-[2px] border-[#2D2D2D] flex items-center justify-center shrink-0"
            style={{ backgroundColor: meta.color }}
          >
            {meta.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold truncate flex items-center gap-1.5">
              {l.title}
              {l.settled ? <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#CDEAC0]">settled</span> : null}
            </p>
            <p className="text-[11px] font-bold text-[#5C5C5C] truncate">
              {meta.label}
              {l.counterparty ? ` · ${l.counterparty}` : ''}
              {l.dueDate ? ` · due ${format(parse(l.dueDate, 'yyyy-MM-dd', new Date()), 'dd MMM')}` : ''}
            </p>
            <div className="h-1.5 rounded-full bg-[#F0ECE4] border-[1.5px] border-[#2D2D2D] overflow-hidden mt-1">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-extrabold">{money(outstanding)}</p>
            <p className="text-[10px] font-bold text-[#5C5C5C]">left of {money(principal)}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => updateLoan(l.id, { settled: !l.settled })}
              className={`p-1.5 rounded-lg transition-colors ${l.settled ? 'text-[#4C8C4A]' : 'text-[#5C5C5C] hover:text-[#4C8C4A]'} hover:bg-[#F0ECE4] min-h-[44px] min-w-[44px] flex items-center justify-center`}
              aria-label="Toggle settled"
            >
              <Check size={14} />
            </button>
<button
  onClick={() => {
    triggerHapticFeedback();
    setEditingLoan(l); setShowLoanForm(true); }}
  className="p-1.5 rounded-lg text-[#5C5C5C] hover:text-[#2A2A2A] hover:bg-[#F0ECE4] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
  aria-label="Edit loan"
>
  <Pencil size={14} />
</button>
             <button
               onClick={() => {
                 setDeleteTarget({ kind: 'loan', id: l.id, label: l.title });
               }}
               className="p-1.5 rounded-lg text-[#5C5C5C] hover:text-[#B85042] hover:bg-[#F0ECE4] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
               aria-label="Delete loan"
             >
               <X size={14} />
             </button>
          </div>
        </div>
      );
    })}
  </div>
)}

<AnimatePresence>
  {showLoanForm && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <LoanForm
        initial={editingLoan ?? undefined}
        onSubmit={(loan) => {
          if (editingLoan) updateLoan(editingLoan.id, loan);
          else addLoan(loan);
          setShowLoanForm(false);
          setEditingLoan(null);
        }}
        onCancel={() => { setShowLoanForm(false); setEditingLoan(null); }}
      />
     </motion.div>
   )}
  </AnimatePresence>
                     </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog
                open={showBudgets}
                onOpenChange={(open) => {
                  if (!open) {
                    setShowBudgets(false);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      triggerHapticFeedback();
                      setShowBudgets(true); setShowForm(false); setShowLoans(false); }}
                    className={`${ACTION_BTN} bg-[#B8D8F8] shadow-[4px_4px_0px_0px_#8FBCEA]`}
                  >
                    <SlidersHorizontal size={16} /> Budgets
                  </button>
                </DialogTrigger>
                <DialogContent
                  showCloseButton={false}
                  className="!max-w-[95vw] !bg-transparent !p-3 !ring-0 sm:!w-[500px]"
                >
                  <BudgetEditor budgets={budgets} onChange={setBudget} onClose={() => setShowBudgets(false)} />
                </DialogContent>
              </Dialog>
            <Dialog open={showForm} onOpenChange={(open) => {
              if (!open) {
                setShowForm(false);
                setEditing(null);
                setPrefillDate(undefined);
              }
            }}>
               <DialogTrigger asChild>
                 <button
                   type="button"
                   onClick={() => {
                     triggerHapticFeedback();
                     startAdd();
                   }}
                   className={`${ACTION_BTN} bg-[#C6E8B8] shadow-[4px_4px_0px_0px_#8BCB78]`}
                   aria-label="Add new transaction"
                 >
                   <Plus size={16} /> Add
                 </button>
               </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="!max-w-[95vw] !bg-transparent !p-3 !ring-0 sm:!max-w-lg"
              >
               <TransactionForm
                   initial={editing ?? undefined}
                   defaultDate={prefillDate}
                   isLoading={isAdding}
                   setIsLoading={setIsAdding}
                   onSubmit={(expense) => {
                     if (editing) updateExpense(editing.id, expense);
                     else addExpense(expense);
                     setShowForm(false);
                     setEditing(null);
                     setPrefillDate(undefined);
                   }}
                   onCancel={() => {
                     setShowForm(false);
                     setEditing(null);
                     setPrefillDate(undefined);
                   }}
                  />
              </DialogContent>
            </Dialog>
          </div>
      </div>


       {/* Period switcher */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div className="inline-flex rounded-xl border-[3px] border-[#2D2D2D] overflow-hidden">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              aria-pressed={period === p.key}
              className={`px-4 py-2 text-xs font-extrabold transition-colors min-h-[40px] flex items-center ${
                period === p.key ? 'bg-[#B8D8F8] text-[#2A2A2A]' : 'bg-[#FFFDF8] text-[#5C5C5C] hover:bg-[#F0ECE4]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
<div className="flex items-center gap-1">
           <button onClick={() => {
             triggerHapticFeedback();
             shiftPeriod(-1); }} className="neo-button p-1.5 bg-[#FFFDF8]" aria-label="Previous period">
             <ChevronLeft size={14} />
           </button>
           <span className="text-sm font-extrabold px-2 min-w-[120px] sm:min-w-[160px] text-center">{range.label}</span>
           <button
             onClick={() => {
               triggerHapticFeedback();
               shiftPeriod(1); }}
             disabled={range.start >= dayKey(new Date())}
             className="neo-button p-1.5 bg-[#FFFDF8] disabled:opacity-40"
             aria-label="Next period"
           >
             <ChevronRight size={14} />
           </button>
         </div>
      </div>

      {/* Overview: earnings / expenses / savings / loans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard
          label="Earnings"
          value={money(summary.income)}
          sub={range.label}
          color="#CDEAC0"
          icon={<TrendingUp size={15} />}
          tint="tint-green"
        />
        <StatCard
          label="Expenses"
          value={money(summary.expense)}
          sub={range.label}
          color="#F8C8C8"
          icon={<TrendingDown size={15} />}
          trend={summary.delta}
          tint="tint-pink"
        />
        <StatCard
          label="Savings"
          value={money(summary.savings)}
          sub={savingsGoal > 0 ? `${Math.round(periodSavingsPct)}% of goal` : `${summary.rate}% of earnings`}
          color="#F7E8A4"
          icon={<PiggyBank size={15} />}
          tint="tint-yellow"
        />
        <StatCard
          label="Loans Outstanding"
          value={moneyShort(loanStats.net)}
          sub={`lent ${moneyShort(loanStats.lentOut)} · owe ${moneyShort(loanStats.borrowedOut)}`}
          color="#B8D8F8"
          icon={<HandCoins size={15} />}
          tint="tint-blue"
        />
      </div>

      {period === 'monthly' ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 mb-5">
          {/* Solid balance card (no gradient) */}
          <div className="relative overflow-hidden rounded-[19px] border-[3px] border-[#2D2D2D] bg-[#EAF4FF] p-6 shadow-[6px_6px_0px_0px_var(--neo-shadow)] tint-blue">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[17px]">
              <div className="absolute -top-14 -right-12 w-48 h-48 rounded-full border-[3px] border-dashed border-[#B8D8F8]/60 animate-spin-slow" />
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#CDEAC0]/30" />
              <div className="absolute bottom-6 -left-6 w-24 h-24 rounded-full bg-[#DCCEF5]/30" />
            </div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C5C5C]">Total Balance</p>
                <div className="w-9 h-9 rounded-xl border-[2px] border-[#2D2D2D] bg-[#F7E8A4] flex items-center justify-center">
                  <Wallet size={16} />
                </div>
              </div>
              <p className="text-4xl font-extrabold mt-1 text-[#2A2A2A]">{money(allTime.balance)}</p>
              <div className="flex gap-4 mt-1 text-[11px] font-extrabold">
                <span className="text-[#4C8C4A] flex items-center gap-1">
                  <ArrowUpRight size={12} /> {moneyShort(allTime.income)} in
                </span>
                <span className="text-[#B85042] flex items-center gap-1">
                  <ArrowDownRight size={12} /> {moneyShort(allTime.expense)} out
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5">
                {accounts.map((a) => (
                  <div key={a.key} className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C] flex items-center gap-1">
                      {a.icon} {a.label}
                    </p>
                    <p className={`text-sm font-extrabold mt-0.5 ${a.balance < 0 ? 'text-[#B85042]' : 'text-[#2A2A2A]'}`}>
                      {moneyShort(a.balance)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <NeoCard className="flex flex-col" color="#F7E8A4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-extrabold flex items-center gap-2">
                <Target size={16} /> Savings &amp; Budget
              </p>
              {!monthStats.isCurrent && (
                <button
                  onClick={() => setAnchor(new Date())}
                  className="text-[11px] font-bold text-[#5C5C5C] hover:text-[#2A2A2A] underline underline-offset-2"
                >
                  Today
                </button>
              )}
            </div>

            {savingsGoal > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-[#5C5C5C] flex items-center gap-1">
                    <PiggyBank size={12} /> Savings goal
                  </span>
                  <span className="text-[11px] font-extrabold">
                    {moneyShort(summary.savings)} / {moneyShort(savingsGoal)}
                  </span>
                </div>
                <div className="h-3 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${periodSavingsPct}%`, backgroundColor: periodSavingsPct >= 100 ? '#CDEAC0' : '#F7E8A4' }}
                  />
                </div>
              </div>
            )}

            {overallBudget > 0 ? (
              <>
                <p className="text-2xl font-extrabold">
                  {money(monthStats.expense)}
                  <span className="text-sm font-bold text-[#5C5C5C]"> / {moneyShort(overallBudget)}</span>
                </p>
                <div className="h-3 rounded-full mt-2 border-[2px] border-[#2D2D2D] bg-[#F0ECE4] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${overallPct}%`, backgroundColor: overallPct >= 100 ? '#F8C8C8' : '#CDEAC0' }}
                  />
                </div>
                <p className="text-[11px] font-bold text-[#5C5C5C] mt-2 flex items-center gap-1">
                  <PiggyBank size={12} />
                  {overallPct >= 100
                    ? `Over budget by ${money(monthStats.expense - overallBudget)}`
                    : `${money(overallBudget - monthStats.expense)} left this month`}
                </p>
              </>
            ) : (
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-sm font-medium text-[#5C5C5C] mb-3">
                  Set a monthly budget and savings goal to stay on track.
                </p>
<button
  onClick={() => {
    triggerHapticFeedback();
    setShowBudgets(true); setShowForm(false); setShowLoans(false); }}
  className="neo-button px-4 py-3 text-sm bg-[#F7E8A4] w-fit tint-yellow min-h-[48px]"
>
  Set budgets
</button>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t-[2px] border-[#2D2D2D]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C]">Saved</p>
                <p className={`text-sm font-extrabold ${summary.savings >= 0 ? 'text-[#4C8C4A]' : 'text-[#B85042]'}`}>
                  {moneyShort(summary.savings)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C]">Savings rate</p>
                <p className="text-sm font-extrabold">{summary.rate}%</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C]">Daily avg</p>
                <p className="text-sm font-extrabold">{moneyShort(monthStats.dailyAvg)}</p>
              </div>
            </div>
          </NeoCard>
        </div>
      ) : period === 'weekly' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 mb-5">
            <PeriodHero
              kicker="Week at a glance"
              dateLabel={range.label}
              income={summary.income}
              expense={summary.expense}
              net={summary.savings}
              rate={summary.rate}
              delta={summary.delta}
              bg="#E4EDFA"
              accent="#B8D8F8"
              tint="tint-blue"
            />

            <NeoCard color="#DCCEF5" className="flex flex-col">
              <SectionTitle
                icon={<CalendarDays size={15} />}
                title={`This Week · ${range.label}`}
                action={
<button
  onClick={() => startAdd()}
  className="neo-button px-3 py-3 text-[11px] bg-[#CDEAC0] tint-green flex items-center gap-1 min-h-[44px]"
>
  <Plus size={12} /> Add
</button>
                }
              />
<div className="grid grid-cols-7 gap-1">
                 {weekStrip.map((d) => {
                   const active = selectedDay === d.date;
                   const isToday = d.date === dayKey(new Date());
                   return (
                     <button
                       key={d.date}
                       onClick={() => {
                         triggerHapticFeedback();
                         setSelectedDay(active ? null : d.date);
                       }}
                      className={`rounded-lg border-[2px] p-1 min-h-[56px] flex flex-col items-center justify-center gap-0.5 transition-all ${
                        active
                          ? 'border-[#2D2D2D] bg-[#FFFDF8] shadow-[2px_2px_0px_0px_var(--neo-shadow)] -translate-y-0.5'
                          : 'border-[#2D2D2D]/40 bg-[#F0ECE4] hover:-translate-y-0.5'
                      }`}
                    >
                      <span className={`text-[9px] font-extrabold uppercase leading-none ${isToday ? 'text-[#B85042]' : 'text-[#5C5C5C]'}`}>
                        {d.dow}
                      </span>
                      <span className="text-sm font-extrabold leading-none">{format(parse(d.date, 'yyyy-MM-dd', new Date()), 'd')}</span>
                      <span className="flex items-center gap-0.5 h-1.5">
                        {d.income > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#4C8C4A] border-[1px] border-[#2D2D2D]" />}
                        {d.expense > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#B85042] border-[1px] border-[#2D2D2D]" />}
                      </span>
                    </button>
                   );
                 })}
               </div>

              <div className="mt-4 pt-4 border-t-[2px] border-[#2D2D2D] flex-1">
                {selectedDay && dayDetail ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-extrabold">
                        {format(parse(selectedDay, 'yyyy-MM-dd', new Date()), 'EEEE, dd MMM')}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-extrabold">
                        <span className="text-[#4C8C4A]">+{moneyShort(dayDetail.income)}</span>
                        <span className="text-[#B85042]">-{moneyShort(dayDetail.expense)}</span>
                      </div>
                    </div>
                    {dayDetail.items.length === 0 ? (
                      <p className="text-xs font-medium text-[#5C5C5C] text-center py-6">Nothing logged on this day.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {dayDetail.items.map((t) => {
                          const c = CATEGORY_META[t.category];
                          const isIncome = t.type === 'income';
                          return (
                            <div key={t.id} className="flex items-center gap-2.5 p-2 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]">
                              <span className="w-7 h-7 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center shrink-0" style={{ backgroundColor: c.color }}>
                                {c.icon}
                              </span>
                              <span className="text-xs font-bold flex-1 min-w-0 truncate">{t.title}</span>
                              <span className={`text-xs font-extrabold whitespace-nowrap ${isIncome ? 'text-[#4C8C4A]' : 'text-[#2A2A2A]'}`}>
                                {isIncome ? '+' : '-'}{moneyShort(t.amount)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs font-medium text-[#5C5C5C] text-center py-6">Tap a day to see its entries.</p>
                )}
              </div>
            </NeoCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
            <BreakdownCard
              title={`Spending by Category · ${range.label}`}
              color="#DCCEF5"
              rows={breakdown.list}
              max={breakdown.max}
            />

            <NeoCard color="#F7E8A4">
              <SectionTitle icon={<Trophy size={15} />} title={`Week in Numbers · ${range.label}`} />
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-[#5C5C5C]">Budget pace</span>
                    <span className="text-[11px] font-extrabold">
                      {weeklyBudget > 0 ? `${money(summary.expense)} / ${money(weeklyBudget)}` : 'no monthly budget set'}
                    </span>
                  </div>
                  {weeklyBudget > 0 && (
                    <div className="h-2 rounded-full bg-[#F0ECE4] border-[2px] border-[#2D2D2D] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${weeklyPace}%`, backgroundColor: weeklyPace >= 100 ? '#F8C8C8' : '#CDEAC0' }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-2.5">
                    <p className="text-[10px] font-bold uppercase text-[#5C5C5C]">Busiest day</p>
                    <p className="text-sm font-extrabold mt-0.5">{weekBusiest ? weekBusiest.dow : '—'}</p>
                    <p className="text-[10px] font-bold text-[#5C5C5C]">{weekBusiest ? money(weekBusiest.amount) : 'no spend'}</p>
                  </div>
                  <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-2.5">
                    <p className="text-[10px] font-bold uppercase text-[#5C5C5C]">Avg / day</p>
                    <p className="text-sm font-extrabold mt-0.5">{money(summary.expense / 7)}</p>
                    <p className="text-[10px] font-bold text-[#5C5C5C]">{summary.rate}% saved</p>
                  </div>
                  <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-2.5">
                    <p className="text-[10px] font-bold uppercase text-[#5C5C5C]">Txns</p>
                    <p className="text-sm font-extrabold mt-0.5">{listSummary.count}</p>
                    <p className="text-[10px] font-bold text-[#5C5C5C]">this week</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C] mb-2">Where money lives</p>
                  <div className="space-y-2">
                    {accountsByPeriod.map((a) => (
                      <div key={a.key} className="flex items-center gap-2.5">
                        <span className="w-7 h-7 shrink-0 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center" style={{ backgroundColor: a.color }}>
                          {a.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold">{a.label}</span>
                            <span className={`text-xs font-extrabold ${a.balance < 0 ? 'text-[#B85042]' : 'text-[#2A2A2A]'}`}>
                              {moneyShort(a.balance)}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#F0ECE4] border-[1.5px] border-[#2D2D2D] overflow-hidden mt-0.5">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${Math.min(100, Math.abs(a.balance))}%`, backgroundColor: a.color }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </NeoCard>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-5 mb-5">
            <PeriodHero
              kicker="Day at a glance"
              dateLabel={range.label}
              income={summary.income}
              expense={summary.expense}
              net={summary.savings}
              rate={summary.rate}
              delta={summary.delta}
              bg="#EFF8EB"
              accent="#CDEAC0"
              tint="tint-green"
            >
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t-[2px] border-[#2D2D2D]">
                {accountsByPeriod.map((a) => (
                  <span
                    key={a.key}
                    className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] px-2.5 py-1.5 flex items-center gap-1.5"
                  >
                    <span className="w-5 h-5 rounded-md border-[1.5px] border-[#2D2D2D] flex items-center justify-center" style={{ backgroundColor: a.color }}>
                      {a.icon}
                    </span>
                    <span className="text-[11px] font-bold">
                      {a.label} <span className={`font-extrabold ${a.balance < 0 ? 'text-[#B85042]' : 'text-[#2A2A2A]'}`}>{moneyShort(a.balance)}</span>
                    </span>
                  </span>
                ))}
              </div>
            </PeriodHero>

            <BreakdownCard
              title="Where it went today"
              color="#F8C8C8"
              rows={breakdown.list}
              max={breakdown.max}
            />
          </div>
        </>
      )}







      

      {period === 'monthly' && (
        <>
          {/* Calendar + day detail */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 mb-5">
        <NeoCard color="#B8D8F8">
<SectionTitle
             icon={<CalendarDays size={15} />}
             title={`Calendar · ${format(calMonth, 'MMMM yyyy')}`}
             action={
               <div className="flex items-center gap-1">
                 <button onClick={() => {
                   triggerHapticFeedback();
                   setCalMonth((m) => addMonths(m, -1)); }} className="neo-button p-1.5 bg-[#FFFDF8]" aria-label="Previous month">
                   <ChevronLeft size={13} />
                 </button>
                 <button
                   onClick={() => {
                     triggerHapticFeedback();
                     setCalMonth(startOfMonth(new Date())); setSelectedDay(dayKey(new Date())); }}
                   className="neo-button px-2.5 py-1.5 text-[11px] bg-[#FFFDF8]"
                 >
                   Today
                 </button>
                 <button onClick={() => {
                   triggerHapticFeedback();
                   setCalMonth((m) => addMonths(m, 1)); }} className="neo-button p-1.5 bg-[#FFFDF8]" aria-label="Next month">
                   <ChevronRight size={13} />
                 </button>
               </div>
             }
           />

          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((d, i) => (
              <div key={i} className="text-center text-[10px] font-extrabold text-[#5C5C5C]">{d}</div>
            ))}
          </div>
<div className="grid grid-cols-7 gap-1">
             {calendar.cells.map((cell, i) => {
               if (!cell) return <div key={`blank-${i}`} />;
               const dateKey = dayKey(new Date(calMonth.getFullYear(), calMonth.getMonth(), cell.day));
               const ratio = calendar.max ? cell.spend / calendar.max : 0;
               const level = cell.spend === 0 ? 0 : ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1;
               const active = selectedDay === dateKey;
               const hasActivity = cell.spend > 0 || cell.income > 0;
               return (
                 <button
                   key={dateKey}
                   onClick={() => {
                     triggerHapticFeedback();
                     setSelectedDay(active ? null : dateKey);
                   }}
                    className={`h-10 sm:h-11 rounded-lg border-[2px] flex flex-col items-center justify-center gap-0.5 transition-all ${
                      active ? 'border-[#2D2D2D] shadow-[2px_2px_0px_0px_var(--neo-shadow)] -translate-y-0.5' : 'border-[#2D2D2D]/40 hover:-translate-y-0.5'
                    }`}
                    style={{ backgroundColor: active ? '#FFFDF8' : HEAT_COLORS[level] }}
                    title={hasActivity ? `${format(parse(dateKey, 'yyyy-MM-dd', new Date()), 'dd MMM')} · out ${money(cell.spend)} · in ${money(cell.income)}` : undefined}
                  >
                    <span className={`text-[10px] font-extrabold leading-none ${cell.isToday ? 'text-[#B85042]' : 'text-[#2A2A2A]'}`}>
                      {cell.day}
                    </span>
                    <span className="flex items-center gap-0.5 h-1.5">
                      {cell.income > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#4C8C4A] border-[1px] border-[#2D2D2D]" />}
                      {cell.spend > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#B85042] border-[1px] border-[#2D2D2D]" />}
                    </span>
                  </button>
               );
             })}
           </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t-[2px] border-[#2D2D2D]">
            <span className="text-[11px] font-bold text-[#5C5C5C]">Less</span>
            <div className="flex items-center gap-1">
              {HEAT_COLORS.map((c) => (
                <span key={c} className="w-3.5 h-3.5 rounded-sm border-[2px] border-[#2D2D2D]" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="text-[11px] font-bold text-[#5C5C5C]">More</span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-[#5C5C5C]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#4C8C4A] border-[1px] border-[#2D2D2D]" /> Earnings</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#B85042] border-[1px] border-[#2D2D2D]" /> Spending</span>
          </div>
        </NeoCard>

        {/* Day detail */}
        <NeoCard color="#DCCEF5" className="flex flex-col">
          {selectedDay && dayDetail ? (
            <>
              <SectionTitle
                icon={<CalendarDays size={15} />}
                title={format(parse(selectedDay, 'yyyy-MM-dd', new Date()), 'EEE, dd MMM yyyy')}
                action={
<button
  onClick={() => startAdd(selectedDay)}
  className="neo-button px-3 py-3 text-[11px] bg-[#CDEAC0] tint-green flex items-center gap-1 min-h-[44px]"
>
  <Plus size={12} /> Add
</button>
                }
              />
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#CDEAC0] p-2">
                  <p className="text-[9px] font-bold uppercase text-[#5C5C5C]">In</p>
                  <p className="text-sm font-extrabold">{moneyShort(dayDetail.income)}</p>
                </div>
                <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#F8C8C8] p-2">
                  <p className="text-[9px] font-bold uppercase text-[#5C5C5C]">Out</p>
                  <p className="text-sm font-extrabold">{moneyShort(dayDetail.expense)}</p>
                </div>
                <div className={`rounded-xl border-[2px] border-[#2D2D2D] p-2 ${dayDetail.net >= 0 ? 'bg-[#F7E8A4]' : 'bg-[#FFD8BE]'}`}>
                  <p className="text-[9px] font-bold uppercase text-[#5C5C5C]">Net</p>
                  <p className="text-sm font-extrabold">{moneyShort(dayDetail.net)}</p>
                </div>
              </div>

              {dayDetail.items.length === 0 ? (
                <p className="text-sm font-medium text-[#5C5C5C] text-center py-8">
                  Nothing logged on this day.
                </p>
              ) : (
                <div className="space-y-1.5 flex-1">
                  {dayDetail.items.map((t) => {
                    const c = CATEGORY_META[t.category];
                    const isIncome = t.type === 'income';
                    return (
                      <div key={t.id} className="flex items-center gap-2.5 p-2 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]">
                        <span className="w-7 h-7 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center shrink-0" style={{ backgroundColor: c.color }}>
                          {c.icon}
                        </span>
                        <span className="text-xs font-bold flex-1 min-w-0 truncate">{t.title}</span>
                        <span className={`text-xs font-extrabold whitespace-nowrap ${isIncome ? 'text-[#4C8C4A]' : 'text-[#2A2A2A]'}`}>
                          {isIncome ? '+' : '-'}{moneyShort(t.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
              <CalendarDays size={36} className="text-[#5C5C5C] mb-3" />
              <p className="text-sm font-extrabold mb-1">Pick a day</p>
              <p className="text-xs font-medium text-[#5C5C5C] max-w-[220px]">
                Tap any date on the calendar to see that day&apos;s earnings and spending.
              </p>
            </div>
          )}
        </NeoCard>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <NeoCard color="#CDEAC0">
          <SectionTitle icon={<TrendingUp size={15} />} title={`${period === 'daily' ? 'Last 7 Days' : period === 'weekly' ? 'Last 6 Weeks' : '6-Month'} Cash Flow`} />
          <div className="flex items-end justify-between gap-2 h-32">
            {trend.map((m) => (
              <div key={m.key} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex items-end gap-1 h-24 w-full justify-center">
                  <div
                    className="w-3.5 rounded-t-md border-[2px] border-[#2D2D2D] bg-[#CDEAC0]"
                    style={{ height: `${Math.max(3, (m.income / trendMax) * 100)}%` }}
                    title={`Earnings ${money(m.income)}`}
                  />
                  <div
                    className="w-3.5 rounded-t-md border-[2px] border-[#2D2D2D] bg-[#F8C8C8]"
                    style={{ height: `${Math.max(3, (m.expense / trendMax) * 100)}%` }}
                    title={`Spent ${money(m.expense)}`}
                  />
                </div>
                <span className="text-[10px] font-bold text-[#5C5C5C]">{m.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t-[2px] border-[#2D2D2D]">
            <span className="text-[11px] font-bold text-[#5C5C5C] flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm border-[2px] border-[#2D2D2D] bg-[#CDEAC0]" /> Earnings
            </span>
            <span className="text-[11px] font-bold text-[#5C5C5C] flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm border-[2px] border-[#2D2D2D] bg-[#F8C8C8]" /> Spending
            </span>
          </div>
        </NeoCard>

        <NeoCard color="#FFD8BE">
          <SectionTitle icon={<Sparkles size={15} />} title={`Insights · ${range.label}`} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C] flex items-center gap-1"><Trophy size={12} /> Top category</p>
              <p className="text-sm font-extrabold mt-0.5 truncate">
                {insights.topCat ? insights.topCat.label : '—'}
              </p>
              <p className="text-[10px] font-bold text-[#5C5C5C]">{insights.topCat ? money(insights.topCat.total) : 'no spend'}</p>
            </div>
            <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C] flex items-center gap-1"><TrendingDown size={12} /> Biggest expense</p>
              <p className="text-sm font-extrabold mt-0.5 truncate">
                {insights.largest ? insights.largest.title : '—'}
              </p>
              <p className="text-[10px] font-bold text-[#5C5C5C]">{insights.largest ? money(insights.largest.amount) : 'no spend'}</p>
            </div>
            <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C] flex items-center gap-1"><Scale size={12} /> Avg / day</p>
              <p className="text-sm font-extrabold mt-0.5">{money(insights.avgPerDay)}</p>
              <p className="text-[10px] font-bold text-[#5C5C5C]">{insights.txCount} transaction{insights.txCount === 1 ? '' : 's'}</p>
            </div>
            <div className="rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#5C5C5C] flex items-center gap-1"><Repeat size={12} /> Recurring</p>
              <p className="text-sm font-extrabold mt-0.5">{insights.recurring}</p>
              <p className="text-[10px] font-bold text-[#5C5C5C]">
                {insights.topAccount ? `top: ${insights.topAccount.label}` : 'no account'}
              </p>
            </div>
          </div>
        {period === 'monthly' && monthStats.isCurrent && (
            <p className="text-[11px] font-bold text-[#5C5C5C] mt-3 pt-3 border-t-[2px] border-[#2D2D2D] flex items-center gap-1">
              <TrendingUp size={12} /> Projected month-end spend {money(monthStats.projected)}
            </p>
          )}
        </NeoCard>
      </div>

      {period === 'monthly' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <BreakdownCard
          title={`Spending by Category · ${range.label}`}
          color="#DCCEF5"
          rows={breakdown.list}
          max={breakdown.max}
        />

        <NeoCard color="#FFD8BE">
          <SectionTitle icon={<Target size={15} />} title={`Category Budgets · ${format(anchor, 'MMMM')}`} />
          {budgetRows.length === 0 ? (
            <div>
              <p className="text-sm font-medium text-[#5C5C5C] mb-3">
                No category budgets set. Add limits to track where your money goes.
              </p>
<button
  onClick={() => {
    triggerHapticFeedback();
    setShowBudgets(true); setShowForm(false); setShowLoans(false); }}
  className="neo-button px-4 py-3 text-sm bg-[#F7E8A4] tint-yellow min-h-[48px]"
>
  Set budgets
</button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {budgetRows.map((b) => (
                <div key={b.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md border-[2px] border-[#2D2D2D] flex items-center justify-center" style={{ backgroundColor: b.color }}>
                        {b.icon}
                      </span>
                      {b.label}
                    </span>
                    <span className={`text-[11px] font-extrabold ${b.over ? 'text-[#B85042]' : 'text-[#5C5C5C]'}`}>
                      {money(b.spent)} / {money(b.limit)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#F0ECE4] border-[2px] border-[#2D2D2D] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${b.pct}%`, backgroundColor: b.over ? '#F8C8C8' : b.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </NeoCard>
      </div>
      )}

      {expenses.length > 0 && !showForm && !showBudgets && !showLoans && (
        <div className="mb-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5C5C]" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search within ${range.label}...`}
                className="neo-input text-sm pl-10 w-full"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | TransactionType)}
                className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] text-sm px-3 py-2 cursor-pointer shadow-[2px_2px_0px_0px_var(--neo-shadow)] focus:outline-none"
              >
                <option value="all">All types</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as ExpenseCategory | '')}
                className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] text-sm px-3 py-2 cursor-pointer shadow-[2px_2px_0px_0px_var(--neo-shadow)] focus:outline-none"
              >
                <option value="">All categories</option>
                {[...EXPENSE_CATS, ...INCOME_CATS.filter((c) => c !== 'other')].map((key) => (
                  <option key={key} value={key}>{CATEGORY_META[key].label}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] text-sm px-3 py-2 cursor-pointer shadow-[2px_2px_0px_0px_var(--neo-shadow)] focus:outline-none"
              >
                <option value="date-desc">Newest first</option>
                <option value="date-asc">Oldest first</option>
                <option value="amount-desc">Highest amount</option>
                <option value="amount-asc">Lowest amount</option>
              </select>
            </div>
            <button
              onClick={exportCsv}
              className="neo-button px-4 py-2 text-sm bg-[#FFFDF8] flex items-center justify-center gap-2 whitespace-nowrap tint-teal"
            >
              <Download size={14} /> CSV
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap mt-3 text-[11px] font-bold">
            <span className="px-2.5 py-1 rounded-full border-[2px] border-[#2D2D2D] bg-[#FFFDF8]">
              {listSummary.count} transaction{listSummary.count === 1 ? '' : 's'}
            </span>
            <span className="px-2.5 py-1 rounded-full border-[2px] border-[#2D2D2D] bg-[#CDEAC0] flex items-center gap-1">
              <ArrowUpRight size={12} /> {money(listSummary.income)}
            </span>
            <span className="px-2.5 py-1 rounded-full border-[2px] border-[#2D2D2D] bg-[#F8C8C8] flex items-center gap-1">
              <ArrowDownRight size={12} /> {money(listSummary.expense)}
            </span>
            <span className={`px-2.5 py-1 rounded-full border-[2px] border-[#2D2D2D] flex items-center gap-1 ${listSummary.net >= 0 ? 'bg-[#CDEAC0]' : 'bg-[#F8C8C8]'}`}>
              <Scale size={12} /> Net {money(listSummary.net)}
            </span>
            {hasFilters && (
              <button onClick={clearFilters} className="px-2.5 py-1 rounded-full border-[2px] border-[#2D2D2D] bg-[#FFFDF8] hover:bg-[#F0ECE4] flex items-center gap-1">
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {grouped.length > 0 && (
        <div className="space-y-6">
          {grouped.map(([date, items]) => {
            const dayNet = items.reduce(
              (s, t) => s + (t.type === 'income' ? Number(t.amount) : -Number(t.amount)),
              0
            );
            return (
              <div key={date}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-extrabold text-[#5C5C5C] uppercase tracking-wider">
                    {format(parse(date, 'yyyy-MM-dd', new Date()), 'EEE, dd MMM yyyy')}
                  </p>
                  <p className={`text-xs font-extrabold ${dayNet >= 0 ? 'text-[#4C8C4A]' : 'text-[#B85042]'}`}>
                    {dayNet >= 0 ? '+' : '-'}{money(Math.abs(dayNet))}
                  </p>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {items.map((t) => {
                      const c = CATEGORY_META[t.category];
                      const isIncome = t.type === 'income';
                      return (
                        <motion.div
                          key={t.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.96 }}
                        >
                          <div className={`neo-card p-3 flex items-center gap-3 ${isIncome ? 'tint-green' : 'tint-pink'}`}>
                            <div
                              className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center shrink-0"
                              style={{ backgroundColor: c.color }}
                            >
                              {c.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-extrabold truncate flex items-center gap-1.5">
                                {t.title}
                                {t.recurring ? <Repeat size={12} className="text-[#5C5C5C] shrink-0" /> : null}
                              </p>
                              <p className="text-[11px] font-bold text-[#5C5C5C] flex items-center gap-1.5 min-w-0">
                                <span className="truncate">{c.label}</span>
                                <span className="inline-flex items-center gap-0.5 text-[#8A8A8A] shrink-0">
                                  · {ACCOUNT_META[t.account].icon} {ACCOUNT_META[t.account].label}
                                </span>
                              </p>
                            </div>
                            <p className={`text-base font-extrabold whitespace-nowrap ${isIncome ? 'text-[#4C8C4A]' : 'text-[#2A2A2A]'}`}>
                              {isIncome ? '+' : '-'}{money(t.amount)}
                            </p>
                            <div className="flex items-center gap-1 shrink-0">
<button
  onClick={() => {
    triggerHapticFeedback();
    setEditing(t); setPrefillDate(undefined); setShowBudgets(false); setShowLoans(false); setShowForm(true); }}
  className="p-1.5 rounded-lg text-[#5C5C5C] hover:text-[#2A2A2A] hover:bg-[#F0ECE4] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
  aria-label="Edit transaction"
>
  <Pencil size={14} />
</button>
                               <button
                                 onClick={() => {
                                   setDeleteTarget({ kind: 'expense', id: t.id, label: t.title });
                                 }}
                                 className="p-1.5 rounded-lg text-[#5C5C5C] hover:text-[#B85042] hover:bg-[#F0ECE4] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                                 aria-label="Delete transaction"
                               >
                                 <X size={14} />
                               </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && expenses.length > 0 && (
        <div className="text-center py-16">
          <Search size={40} className="mx-auto text-[#5C5C5C] mb-4" />
          <p className="text-lg font-extrabold mb-1">No transactions found</p>
          <p className="text-sm text-[#5C5C5C] font-medium">
            Nothing logged for {range.label}. Try a different period or filter.
          </p>
        </div>
      )}

      {expenses.length === 0 && !showForm && !showBudgets && !showLoans && (
        <div className="text-center py-16">
          <Wallet size={48} className="mx-auto text-[#5C5C5C] mb-4" />
          <p className="text-lg font-extrabold mb-1">No transactions yet</p>
          <p className="text-sm text-[#5C5C5C] font-medium">Log your first income or expense to get started</p>
        </div>
      )}

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent showCloseButton={false} className="!max-w-[95vw] !bg-transparent !p-3 !ring-0 sm:!max-w-sm">
          <div className="neo-card tint-pink relative w-full p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] bg-[#F8C8C8] flex items-center justify-center shrink-0">
                <Trash2 size={18} />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-extrabold">
                  Delete {deleteTarget?.kind === 'loan' ? 'loan' : 'transaction'}?
                </h2>
                <p className="text-xs font-bold text-[#5C5C5C] truncate">{deleteTarget?.label}</p>
              </div>
              <button
                type="button"
                aria-label="Close delete confirmation"
                onClick={() => setDeleteTarget(null)}
                className={`${CLOSE_BTN} ml-auto shrink-0 shadow-none`}
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-xs font-medium text-[#5C5C5C] mb-4">
              This action can&apos;t be undone.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="neo-button flex-1 px-4 py-3 text-sm bg-[#FFFDF8] min-h-[48px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHapticFeedback();
                  if (!deleteTarget) return;
                  if (deleteTarget.kind === 'loan') deleteLoan(deleteTarget.id);
                  else deleteExpense(deleteTarget.id);
                  setDeleteTarget(null);
                }}
                className="neo-button flex-1 px-4 py-3 text-sm bg-[#F8C8C8] tint-pink font-extrabold min-h-[48px]"
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
