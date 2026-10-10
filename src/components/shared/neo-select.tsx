'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface NeoSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

export function NeoSelect({ value, onChange, options, className = '' }: NeoSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="neo-input text-xs py-1.5 w-full flex items-center justify-between gap-2 cursor-pointer"
      >
        <span>{selected?.label || value}</span>
        <ChevronDown size={12} className={`transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] shadow-[3px_3px_0px_0px_var(--neo-shadow)] overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                opt.value === value
                  ? 'bg-[#F7E8A4] font-extrabold'
                  : 'hover:bg-[#F0ECE4]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
