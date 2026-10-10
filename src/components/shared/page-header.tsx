'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] bg-accent flex items-center justify-center shadow-[3px_3px_0px_0px_var(--neo-shadow)] tint-blue">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-extrabold text-[#2A2A2A]">{title}</h1>
          {description && (
            <p className="text-sm text-[#5C5C5C] font-medium mt-0.5">{description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
