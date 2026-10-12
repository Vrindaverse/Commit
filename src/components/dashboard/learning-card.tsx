'use client';

import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/shared/progress-bar';
import type { LearningPath } from '@/types';
import { slideUp, stagger } from './motion';

interface LearningCardProps {
  learningPaths: LearningPath[];
  onOpen: () => void;
}

export default function LearningCard({ learningPaths, onOpen }: LearningCardProps) {
  const visible = learningPaths.slice(0, 3);
  return (
    <NeoCard color="#FFD8BE">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFD8BE] flex items-center justify-center"><BookOpen size={18} /></div>
          <h3 className="text-sm font-extrabold">Learning</h3>
        </div>
        <Button onClick={onOpen} variant="outline" size="xs" className="text-muted-foreground min-h-[44px] sm:min-h-6">
          View All
        </Button>
      </div>
      {visible.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
          {visible.map(lp => (
            <motion.div key={lp.id} variants={slideUp}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold">{lp.title}</span>
                <span className="text-xs font-bold text-[#5C5C5C]">{lp.progress}%</span>
              </div>
              <ProgressBar value={lp.progress} color={lp.color} height={8} showLabel={false} />
              <div className="flex gap-2 mt-1">
                {lp.modules.filter(m => m.completed).length > 0 && (
                  <span className="text-xs font-medium text-[#5C5C5C]">{lp.modules.filter(m => m.completed).length}/{lp.modules.length} modules</span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-xs text-[#5C5C5C] text-center py-4">No learning paths yet.</p>
      )}
    </NeoCard>
  );
}
