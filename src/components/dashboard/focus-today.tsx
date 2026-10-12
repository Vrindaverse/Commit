'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ListChecks } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import { Button } from '@/components/ui/button';
import type { Task } from '@/types';
import { slideLeft, stagger } from './motion';

interface FocusTodayProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onOpen: () => void;
}

export default function FocusToday({ tasks, onComplete, onOpen }: FocusTodayProps) {
  return (
    <NeoCard color="#B8D8F8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border-[3px] border-[#2D2D2D] bg-[#B8D8F8] flex items-center justify-center"><ListChecks size={18} /></div>
          <h2 className="text-lg font-extrabold">Focus Today</h2>
        </div>
        <Button onClick={onOpen} variant="outline" size="xs" className="text-muted-foreground flex items-center gap-1 min-h-[44px] sm:min-h-6">
          All Tasks <ArrowRight size={12} />
        </Button>
      </div>
      {tasks.length > 0 ? (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-2">
          {tasks.map(task => (
            <motion.div key={task.id} variants={slideLeft}
              className="flex items-center gap-3 p-3 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] hover:bg-[#F0ECE4] cursor-pointer transition-colors"
              onClick={() => onComplete(task.id)}
            >
              <div className="w-5 h-5 rounded-md border-[2px] border-[#2D2D2D] flex-shrink-0 hover:bg-[#CDEAC0] transition-colors" />
              <span className="text-sm font-medium flex-1">{task.title}</span>
              {task.dueDate && (
                <span className="text-xs font-bold text-[#5C5C5C]">{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              )}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border-[2px] border-[#2D2D2D] ${task.priority === 'urgent' ? 'bg-[#F8C8C8]' : task.priority === 'high' ? 'bg-[#FFD8BE]' : 'bg-[#F7E8A4]'}`}>
                {task.priority}
              </span>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-sm text-[#5C5C5C] font-medium text-center py-8">All tasks completed!</p>
      )}
    </NeoCard>
  );
}
