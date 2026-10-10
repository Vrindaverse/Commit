'use client';

import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-16 h-16 rounded-2xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] flex items-center justify-center shadow-[4px_4px_0px_0px_var(--neo-shadow)] mb-4">
        {icon || <Inbox size={28} className="text-[#5C5C5C]" />}
      </div>
      <h3 className="text-lg font-extrabold text-[#2A2A2A] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[#5C5C5C] font-medium max-w-xs text-center">{description}</p>
      )}
    </motion.div>
  );
}
