export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'INR', symbol: '₹', label: 'INR — Indian Rupee (₹)', locale: 'en-IN' },
  { code: 'USD', symbol: '$', label: 'USD — US Dollar ($)', locale: 'en-US' },
  { code: 'EUR', symbol: '€', label: 'EUR — Euro (€)', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', label: 'GBP — British Pound (£)', locale: 'en-GB' },
];

export const DEFAULT_CURRENCY: CurrencyCode = 'INR';

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && CURRENCIES.some(c => c.code === value);
}

export function getCurrency(code?: string | null): CurrencyInfo {
  return CURRENCIES.find(c => c.code === code) ?? CURRENCIES[0];
}

export function currencySymbol(code?: string | null): string {
  return getCurrency(code).symbol;
}

const toNumber = (value: string | number): number => {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
};

/** Indian grouping uses Cr/L/k; other locales use B/M/k. */
export function formatMoneyShort(value: string | number, code?: string | null): string {
  const { symbol } = getCurrency(code);
  const n = toNumber(value);
  const sign = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (code === 'INR' || code == null) {
    if (a >= 10000000) return `${sign}${symbol}${(a / 10000000).toFixed(2)}Cr`;
    if (a >= 100000) return `${sign}${symbol}${(a / 100000).toFixed(2)}L`;
    if (a >= 1000) return `${sign}${symbol}${(a / 1000).toFixed(1)}k`;
    return `${sign}${symbol}${a.toFixed(0)}`;
  }
  if (a >= 1000000000) return `${sign}${symbol}${(a / 1000000000).toFixed(2)}B`;
  if (a >= 1000000) return `${sign}${symbol}${(a / 1000000).toFixed(2)}M`;
  if (a >= 1000) return `${sign}${symbol}${(a / 1000).toFixed(1)}k`;
  return `${sign}${symbol}${a.toFixed(0)}`;
}

export function formatMoney(value: string | number, code?: string | null): string {
  const { symbol, locale } = getCurrency(code);
  const n = toNumber(value);
  const abs = Math.abs(n);
  const body = abs.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${n < 0 ? '-' : ''}${symbol}${body}`;
}
