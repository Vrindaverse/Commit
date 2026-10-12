'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, Code, Cpu, Shield, Terminal, Palette, Languages, Plus, X, Save } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import ProgressBar from '@/components/shared/progress-bar';
import PageHeader from '@/components/shared/page-header';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useLifeStore, genId } from '@/store/use-store';
import { LearningPath } from '@/types';

const pathIcons: Record<string, React.ReactNode> = {
  'React & Next.js': <Code size={22} />,
  'Machine Learning': <Cpu size={22} />,
  'Cybersecurity Fundamentals': <Shield size={22} />,
  'Linux Administration': <Terminal size={22} />,
  'UI/UX Design': <Palette size={22} />,
  'Spanish': <Languages size={22} />,
  'Reading List 2026': <BookOpen size={22} />,
};

const categoryColors: Record<string, string> = {
  'Web Development': '#B8D8F8',
  'AI & ML': '#DCCEF5',
  'Cyber Security': '#F8C8C8',
  'Linux': '#F7E8A4',
  'UI/UX': '#FFD8BE',
  'Languages': '#CDEAC0',
  'Books': '#F7E8A4',
};

const allCategories = ['Web Development', 'AI & ML', 'Cyber Security', 'Linux', 'UI/UX', 'Languages', 'Books'];
const colorOptions = ['#B8D8F8', '#CDEAC0', '#F7E8A4', '#FFD8BE', '#F8C8C8', '#DCCEF5'];

function AddPathForm({ onDone }: { onDone: () => void }) {
  const addLearningPath = useLifeStore(s => s.addLearningPath);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(allCategories[0]);
  const [color, setColor] = useState(colorOptions[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addLearningPath({
      id: genId(),
      title: title.trim(),
      description: description.trim(),
      category,
      progress: 0,
      modules: [],
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
        <h3 className="text-sm font-extrabold">New Learning Path</h3>
        <button type="button" onClick={onDone} className="neo-button p-1.5 bg-[#FFFDF8] cursor-pointer"><X size={14} /></button>
      </div>
      <div className="space-y-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Path title..." className="neo-input w-full text-sm font-bold" autoFocus required />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description (optional)" className="neo-input w-full text-xs" />
        <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="neo-input w-full text-xs" />
        <div>
          <span className="text-[10px] font-bold text-[#5C5C5C] mb-1.5 block">Color</span>
          <div className="flex gap-2 items-center">
            {colorOptions.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)} className={`w-7 h-7 rounded-full border-[3px] border-[#2D2D2D] transition-all ${color === c ? 'scale-110 shadow-[2px_2px_0px_0px_var(--neo-shadow)]' : ''}`} style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <button type="submit" className="neo-button px-5 py-2 text-xs bg-[#CDEAC0] font-extrabold cursor-pointer">Create Path</button>
      </div>
    </motion.form>
  );
}

function PathEditDialog({ path, open, onOpenChange }: { path: LearningPath; open: boolean; onOpenChange: (v: boolean) => void }) {
  const updateLearningPath = useLifeStore(s => s.updateLearningPath);
  const [title, setTitle] = useState(path.title);
  const [description, setDescription] = useState(path.description || '');
  const [category, setCategory] = useState(path.category);
  const [color, setColor] = useState(path.color);

  const handleSave = () => {
    if (!title.trim()) return;
    updateLearningPath(path.id, { title: title.trim(), description: description.trim(), category, color });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neo-card !p-5 !shadow-[6px_6px_0px_0px_var(--neo-shadow)] !border-[3px] !border-[#2D2D2D] !rounded-[20px] !ring-0 max-w-md">
        <DialogTitle className="text-base font-extrabold mb-4">Edit Learning Path</DialogTitle>
        <div className="space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Path title" className="neo-input w-full text-sm font-bold" autoFocus />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className="neo-input w-full text-xs" />
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="neo-input w-full text-xs" />
          <div>
            <span className="text-[10px] font-bold text-[#5C5C5C] mb-1.5 block">Color</span>
            <div className="flex gap-2 items-center">
              {colorOptions.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)} className={`w-7 h-7 rounded-full border-[3px] border-[#2D2D2D] transition-all ${color === c ? 'scale-110 shadow-[2px_2px_0px_0px_var(--neo-shadow)]' : ''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <DialogClose className="neo-button px-4 py-2 text-xs bg-[#FFFDF8] cursor-pointer">Cancel</DialogClose>
          <button onClick={handleSave} className="neo-button px-4 py-2 text-xs bg-[#CDEAC0] font-extrabold flex items-center gap-1.5"><Save size={12} /> Save</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PathCard({ path, compact }: { path: LearningPath; compact?: boolean }) {
  const toggleModule = useLifeStore(s => s.toggleModule);
  const deleteLearningPath = useLifeStore(s => s.deleteLearningPath);
  const addModule = useLifeStore(s => s.addModule);
  const deleteModule = useLifeStore(s => s.deleteModule);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModule, setNewModule] = useState('');

  const handleAddModule = () => {
    if (!newModule.trim()) return;
    addModule(path.id, newModule.trim());
    setNewModule('');
    setShowAddModule(false);
  };

  const visibleModules = compact ? path.modules.slice(0, 3) : path.modules;
  const extraCount = path.modules.length - 3;

  return (
    <>
      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <NeoCard color={path.color}>
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center shrink-0 flex-shrink-0" style={{ backgroundColor: path.color }}>
              {pathIcons[path.title] || <BookOpen size={22} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold">{path.title}</h3>
                <button onClick={() => setEditDialogOpen(true)} className="rounded-sm border-[2px] border-[#2D2D2D] bg-[#FFFDF8] px-2 py-0.5 text-[9px] font-extrabold hover:bg-[#F0ECE4] transition-colors">Edit</button>
                <button onClick={() => deleteLearningPath(path.id)} className="rounded-sm border-[2px] border-[#2D2D2D] bg-[#FFFDF8] text-[#5C5C5C] hover:text-[#F8C8C8] px-1 py-0.5 ml-auto">X</button>
              </div>
              {path.description && <p className="text-[10px] text-[#5C5C5C] font-medium mt-0.5">{path.description}</p>}
              <span className="rounded-full border border-[2px] border-[#2D2D2D] px-2 py-0.5 text-[9px] font-bold inline-block mt-1" style={{ backgroundColor: categoryColors[path.category] || '#F0ECE4' }}>
                {path.category}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-extrabold">Progress</span>
              <span className="text-sm font-extrabold text-[#5C5C5C]">{path.progress}%</span>
            </div>
            <ProgressBar value={path.progress} color={path.color} />
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {visibleModules.map((module, i) => (
                <motion.div key={module.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0, margin: 0 }}>
                  <div className="flex items-center gap-2 rounded-sm border border-[#2D2D2D] bg-[#FFFDF8] px-2 py-1 group">
                    <button onClick={() => toggleModule(path.id, i)} className="shrink-0">
                      {module.completed ? <CheckCircle2 size={16} className="text-[#CDEAC0]" /> : <Circle size={16} className="text-[#5C5C5C]" />}
                    </button>
                    <span className={`text-xs font-medium flex-1 ${module.completed ? 'line-through text-[#5C5C5C]' : ''}`}>{module.name}</span>
                    <button onClick={() => deleteModule(path.id, i)} className="opacity-0 group-hover:opacity-100 text-[#5C5C5C] hover:text-[#F8C8C8] transition-all">X</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {compact && extraCount > 0 && (
              <p className="text-[10px] font-bold text-[#5C5C5C] text-center py-1">+{extraCount} more modules</p>
            )}
          </div>

          {!compact && (
            <>
              {showAddModule ? (
                <div className="flex items-center gap-2 mt-3">
                  <input value={newModule} onChange={e => setNewModule(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddModule()} placeholder="Module name..." className="neo-input text-xs py-1.5 flex-1" autoFocus />
                  <button onClick={handleAddModule} className="neo-button px-2.5 py-1.5 text-xs bg-[#CDEAC0] font-extrabold">Add</button>
                  <button onClick={() => setShowAddModule(false)} className="rounded-sm border-[2px] border-[#2D2D2D] bg-[#FFFDF8]">X</button>
                </div>
              ) : (
                <button onClick={() => setShowAddModule(true)} className="w-full py-2 rounded-xl border-[2px] border-dashed border-[#2D2D2D] text-xs font-bold text-[#5C5C5C] hover:bg-[#F0ECE4] transition-colors flex items-center justify-center gap-1">
                  <Plus size={12} /> Add Module
                </button>
              )}
            </>
          )}

          {compact && (
            <button onClick={() => setEditDialogOpen(true)} className="w-full py-2 rounded-sm border-[2px] border-dashed border-[#2D2D2D] text-xs font-bold text-[#5C5C5C] hover:bg-[#F0ECE4] transition-colors">
              Manage Modules
            </button>
          )}
        </NeoCard>
      </motion.div>

      <PathEditDialog path={path} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </>
  );
}

export default function LearningPage() {
  const learningPaths = useLifeStore(s => s.learningPaths);
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <PageHeader title="Learning" description="Track your learning paths and skill development" icon={<BookOpen size={20} />} />
        <button onClick={() => setShowNew(!showNew)} className="neo-button px-4 py-2 text-sm bg-[#F7E8A4] flex items-center gap-2 whitespace-nowrap">
          <Plus size={16} /> {showNew ? 'Cancel' : 'New Path'}
        </button>
      </div>

      <AnimatePresence>{showNew && <AddPathForm onDone={() => setShowNew(false)} />}</AnimatePresence>

      {learningPaths.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={48} className="mx-auto text-[#5C5C5C] mb-4" />
          <p className="text-lg font-extrabold mb-1">No learning paths yet</p>
          <p className="text-sm text-[#5C5C5C] font-medium">Create your first learning path to get started</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {learningPaths.map((path, i) => {
          const isFeatured = i % 3 === 0;
          return (
            <div key={path.id} className={isFeatured ? 'md:col-span-2' : 'md:col-span-1'}>
              <PathCard path={path} compact={!isFeatured} />
            </div>
          );
        })}
      </div>
    </div>
  );
}