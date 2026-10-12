'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/shared/progress-bar';
import type { Project } from '@/types';
import { slideLeft, stagger } from './motion';

interface ActiveProjectsProps {
  projects: Project[];
  onOpen: () => void;
}

export default function ActiveProjects({ projects, onOpen }: ActiveProjectsProps) {
  return (
    <NeoCard color="#DCCEF5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#DCCEF5] flex items-center justify-center"><Rocket size={18} /></div>
          <h2 className="text-lg font-extrabold">Active Projects</h2>
        </div>
        <Button onClick={onOpen} variant="outline" size="xs" className="text-muted-foreground flex items-center gap-1 min-h-[44px] sm:min-h-6">
          View All <ArrowRight size={12} />
        </Button>
      </div>
      {projects.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
          {projects.map(p => (
            <motion.div key={p.id} variants={slideLeft} className="p-4 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg border-[2px] border-[#2D2D2D] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: p.color }}>
                  <Rocket size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-extrabold truncate">{p.title}</h4>
                  <p className="text-xs font-medium text-[#5C5C5C] truncate">{p.description}</p>
                </div>
                <span className="text-sm font-extrabold">{p.progress}%</span>
              </div>
              <ProgressBar value={p.progress} color={p.color} height={8} showLabel={false} />
              <div className="flex gap-4 mt-2">
                <span className="text-xs font-medium text-[#5C5C5C]">{p.milestones.filter(m => m.completed).length}/{p.milestones.length} milestones</span>
                <span className="text-xs font-medium text-[#5C5C5C]">{p.tasks.length} tasks</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-sm text-[#5C5C5C] font-medium text-center py-4">No active projects.</p>
      )}
    </NeoCard>
  );
}
