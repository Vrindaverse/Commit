'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Clock, CheckCircle2, Circle, Plus, X, Save, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NeoCard from '@/components/shared/neo-card';
import ProgressBar from '@/components/shared/progress-bar';
import PageHeader from '@/components/shared/page-header';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { NeoSelect } from '@/components/shared/neo-select';
import { useLifeStore, genId } from '@/store/use-store';
import { Goal, GoalCategory } from '@/types';

const colorOptions = ['#B8D8F8', '#CDEAC0', '#F7E8A4', '#FFD8BE', '#F8C8C8', '#DCCEF5'];

const categoryColors: Record<string, string> = {
  'long-term': '#DCCEF5',
  'medium-term': '#B8D8F8',
  'short-term': '#CDEAC0',
};

const categoryLabels: Record<string, string> = {
  'long-term': 'Long Term',
  'medium-term': 'Medium Term',
  'short-term': 'Short Term',
};

function AddGoalForm({ onDone }: { onDone: () => void }) {
  const addGoal = useLifeStore(s => s.addGoal);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GoalCategory>('short-term');
  const [deadline, setDeadline] = useState('');
  const [color, setColor] = useState('#CDEAC0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal({
      id: genId(),
      title: title.trim(),
      description: description.trim(),
      category,
      deadline: deadline || new Date().toISOString().split('T')[0],
      progress: 0,
      milestones: [],
      color,
    });
    onDone();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0, marginBottom: 0 }}
      transition={{ duration: 0.25 }}
      className="neo-card p-5 mb-8 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold">New Goal</h3>
        <button type="button" onClick={onDone} className="neo-button p-1.5 bg-[#FFFDF8] cursor-pointer"><X size={14} /></button>
      </div>
      <div className="space-y-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Goal title..." className="neo-input w-full text-sm font-bold" autoFocus required />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description (optional)" className="neo-input w-full text-xs" />
        <div className="flex gap-2">
          <div className="flex-1">
            <span className="text-[10px] font-bold text-[#5C5C5C] mb-1 block">Category</span>
            <NeoSelect
              value={category}
              onChange={v => setCategory(v as GoalCategory)}
              options={[
                { value: 'short-term', label: 'Short Term' },
                { value: 'medium-term', label: 'Medium Term' },
                { value: 'long-term', label: 'Long Term' },
              ]}
            />
          </div>
          <div className="w-40">
            <span className="text-[10px] font-bold text-[#5C5C5C] mb-1 block">Deadline</span>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="neo-input text-xs py-1.5 w-full" />
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#5C5C5C] mb-1.5 block">Color</span>
          <div className="flex gap-2 items-center">
            {colorOptions.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)} className={`w-7 h-7 rounded-full border-[3px] border-[#2D2D2D] transition-all ${color === c ? 'scale-110 shadow-[2px_2px_0px_0px_var(--neo-shadow)]' : ''}`} style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <button type="submit" className="neo-button px-5 py-2 text-xs bg-[#CDEAC0] font-extrabold cursor-pointer">Create Goal</button>
      </div>
    </motion.form>
  );
}

function GoalEditDialog({ goal, open, onOpenChange }: { goal: Goal; open: boolean; onOpenChange: (v: boolean) => void }) {
  const updateGoal = useLifeStore(s => s.updateGoal);
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description);
  const [category, setCategory] = useState<GoalCategory>(goal.category);
  const [deadline, setDeadline] = useState(goal.deadline);
  const [color, setColor] = useState(goal.color);

  const handleSave = () => {
    if (!title.trim()) return;
    updateGoal(goal.id, { title: title.trim(), description: description.trim(), category, deadline, color });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neo-card !p-6 !shadow-[6px_6px_0px_0px_var(--neo-shadow)] !border-[3px] !border-[#2D2D2D] !rounded-[20px] !ring-0 max-w-md">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center" style={{ backgroundColor: goal.color }}>
            <Target size={18} />
          </div>
          <DialogTitle className="text-base font-extrabold m-0">Edit Goal</DialogTitle>
        </div>
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold text-[#5C5C5C] mb-1 block">Title</span>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Goal title" className="neo-input w-full text-sm font-bold" autoFocus />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#5C5C5C] mb-1 block">Description</span>
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className="neo-input w-full text-xs" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-[#5C5C5C] mb-1 block">Category</span>
              <NeoSelect
                value={category}
                onChange={v => setCategory(v as GoalCategory)}
                options={[
                  { value: 'short-term', label: 'Short Term' },
                  { value: 'medium-term', label: 'Medium Term' },
                  { value: 'long-term', label: 'Long Term' },
                ]}
              />
            </div>
            <div className="w-40">
              <span className="text-[10px] font-bold text-[#5C5C5C] mb-1 block">Deadline</span>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="neo-input text-xs py-1.5 w-full" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#5C5C5C] mb-1.5 block">Color</span>
            <div className="flex gap-2 items-center">
              {colorOptions.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)} className={`w-7 h-7 rounded-full border-[3px] border-[#2D2D2D] transition-all ${color === c ? 'scale-110 shadow-[2px_2px_0px_0px_var(--neo-shadow)]' : ''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-5 pt-4 border-t-[2px] border-[#2D2D2D]">
          <DialogClose className="neo-button px-4 py-2 text-xs bg-[#FFFDF8] cursor-pointer">Cancel</DialogClose>
          <button onClick={handleSave} className="neo-button px-4 py-2 text-xs bg-[#CDEAC0] font-extrabold flex items-center gap-1.5"><Save size={12} /> Save</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SortableGoalCard({ goal }: { goal: Goal }) {
  const toggleMilestone = useLifeStore(s => s.toggleMilestone);
  const deleteMilestone = useLifeStore(s => s.deleteMilestone);
  const addMilestone = useLifeStore(s => s.addMilestone);
  const deleteGoal = useLifeStore(s => s.deleteGoal);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState('');

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto' as const,
  };

  const handleAddMilestone = () => {
    if (newMilestone.trim()) {
      addMilestone(goal.id, newMilestone.trim());
      setNewMilestone('');
    }
  };

  return (
    <>
      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} ref={setNodeRef} style={style}>
        <NeoCard color={goal.color}>
          <div className="flex items-start gap-2 mb-3">
            <button {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing text-[#5C5C5C] hover:text-[#2A2A2A] shrink-0">
              <GripVertical size={18} />
            </button>
            <button onClick={() => setEditDialogOpen(true)} className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center shrink-0" style={{ backgroundColor: goal.color }}>
              <Target size={18} />
            </button>
            <div onClick={() => setEditDialogOpen(true)} onKeyDown={e => e.key === 'Enter' && setEditDialogOpen(true)} tabIndex={0} role="button" className="flex-1 min-w-0 text-left cursor-pointer">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold truncate">{goal.title}</h3>
                <button onClick={e => { e.stopPropagation(); deleteGoal(goal.id); }} className="neo-button p-1 bg-[#FFFDF8] text-[#5C5C5C] hover:text-[#F8C8C8] ml-auto shrink-0"><X size={12} /></button>
              </div>
              {goal.description && <p className="text-[10px] text-[#5C5C5C] font-medium mt-0.5">{goal.description}</p>}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border-[2px] border-[#2D2D2D]" style={{ backgroundColor: categoryColors[goal.category] || '#F0ECE4' }}>
                  {categoryLabels[goal.category] || goal.category}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[#5C5C5C] font-medium"><Clock size={10} />{goal.deadline}</span>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <ProgressBar value={goal.progress} color={goal.color} />
          </div>

          <div className="space-y-1.5">
            <AnimatePresence>
              {goal.milestones.map(m => (
                <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-2 group/m">
                  <button onClick={() => toggleMilestone(goal.id, m.id)} className="shrink-0">
                    {m.completed ? <CheckCircle2 size={14} className="text-[#CDEAC0]" /> : <Circle size={14} className="text-[#5C5C5C]" />}
                  </button>
                  <span className={`text-xs font-medium flex-1 ${m.completed ? 'line-through text-[#5C5C5C]' : ''}`}>{m.title}</span>
                  <button onClick={() => deleteMilestone(goal.id, m.id)} className="opacity-0 group-hover/m:opacity-100 text-[#5C5C5C] hover:text-[#F8C8C8] transition-all shrink-0"><X size={12} /></button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 mt-3">
            <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddMilestone()} placeholder="New milestone..." className="neo-input flex-1 text-xs py-1.5" />
            <button onClick={handleAddMilestone} className="neo-button p-2 bg-[#F7E8A4] cursor-pointer"><Plus size={14} /></button>
          </div>
        </NeoCard>
      </motion.div>

      <GoalEditDialog goal={goal} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </>
  );
}

function GoalSection({ title, color, goals }: { title: string; color: string; goals: Goal[] }) {
  const reorderGoals = useLifeStore(s => s.reorderGoals);
  const allGoals = useLifeStore(s => s.goals);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = allGoals.findIndex(g => g.id === active.id);
    const newIndex = allGoals.findIndex(g => g.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = [...allGoals];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    reorderGoals(reordered);
  };

  if (goals.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-extrabold text-[#2A2A2A] mb-4 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full border-[2px] border-[#2D2D2D]" style={{ backgroundColor: color }} /> {title}
      </h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={goals.map(g => g.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map(g => <SortableGoalCard key={g.id} goal={g} />)}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default function GoalsPage() {
  const goals = useLifeStore(s => s.goals);
  const [showAdd, setShowAdd] = useState(false);
  const longTerm = goals.filter(g => g.category === 'long-term');
  const mediumTerm = goals.filter(g => g.category === 'medium-term');
  const shortTerm = goals.filter(g => g.category === 'short-term');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Goals" description="Track your long-term vision and short-term objectives" icon={<Target size={20} />} />
        <button onClick={() => setShowAdd(!showAdd)} className="neo-button px-4 py-2 text-sm bg-[#F7E8A4] flex items-center gap-2 whitespace-nowrap">
          <Plus size={16} /> {showAdd ? 'Cancel' : 'New Goal'}
        </button>
      </div>

      <AnimatePresence>{showAdd && <AddGoalForm onDone={() => setShowAdd(false)} />}</AnimatePresence>

      {goals.length === 0 && (
        <div className="text-center py-16">
          <Target size={48} className="mx-auto text-[#5C5C5C] mb-4" />
          <p className="text-lg font-extrabold mb-1">No goals yet</p>
          <p className="text-sm text-[#5C5C5C] font-medium">Add your first goal to get started</p>
        </div>
      )}

      <GoalSection title="Long Term Goals" color="#DCCEF5" goals={longTerm} />
      <GoalSection title="Medium Term Goals" color="#B8D8F8" goals={mediumTerm} />
      <GoalSection title="Short Term Goals" color="#CDEAC0" goals={shortTerm} />
    </div>
  );
}