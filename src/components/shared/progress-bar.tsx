'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export default function ProgressBar({ value, color = '#F7E8A4', height = 10, showLabel = true }: ProgressBarProps) {
  const clamped = Number.isFinite(value) ? Math.max(0, Math.min(value, 100)) : 0;
  return (
    <div className="w-full">
      <div
        className="w-full rounded-full border-[2px] border-[#2D2D2D] overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <p className="text-xs font-bold text-[#5C5C5C] mt-1">{Math.round(clamped)}%</p>
      )}
    </div>
  );
}
