'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotebookPen, Smile, Meh, Frown, Plus, X, Search, Calendar } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import PageHeader from '@/components/shared/page-header';
import { useLifeStore, genId } from '@/store/use-store';
import { Mood, JournalEntry } from '@/types';
import { format, parse } from 'date-fns';

const moodIcons: Record<Mood, { icon: React.ReactNode; color: string; label: string }> = {
  great: { icon: <Smile size={20} />, color: '#CDEAC0', label: 'Great' },
  good: { icon: <Smile size={20} />, color: '#B8D8F8', label: 'Good' },
  okay: { icon: <Meh size={20} />, color: '#F7E8A4', label: 'Okay' },
  bad: { icon: <Frown size={20} />, color: '#FFD8BE', label: 'Bad' },
  awful: { icon: <Frown size={20} />, color: '#F8C8C8', label: 'Awful' },
};

function NewEntryForm({ onDone }: { onDone: () => void }) {
  const addEntry = useLifeStore(s => s.addEntry);
  const [mood, setMood] = useState<Mood>('good');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    addEntry({
      id: genId(),
      date: new Date().toISOString().split('T')[0],
      title: title.trim(),
      content: content.trim(),
      mood,
      tags,
    });
    onDone();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="neo-card p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold">New Entry</h2>
        <button type="button" onClick={onDone} className="neo-button p-2 bg-[#FFFDF8]"><X size={14} /></button>
      </div>

      <div className="mb-4">
        <label className="text-xs font-bold text-[#5C5C5C] block mb-2">How are you feeling?</label>
        <div className="flex gap-2">
          {(Object.entries(moodIcons) as [Mood, typeof moodIcons[Mood]][]).map(([key, m]) => (
            <button key={key} type="button" onClick={() => setMood(key)} className={`w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center transition-all ${mood === key ? 'shadow-[3px_3px_0px_0px_var(--neo-shadow)]' : ''}`} style={{ backgroundColor: mood === key ? m.color : '#FFFDF8' }}>
              {m.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Entry title..." className="neo-input w-full text-sm font-bold" required />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your thoughts..." rows={4} className="neo-input w-full text-sm resize-none" required />
        <div className="flex gap-2 items-center">
          <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="Add a tag..." className="neo-input text-xs py-1.5 flex-1" />
          <button type="button" onClick={addTag} className="neo-button p-2 bg-[#F7E8A4]"><Plus size={14} /></button>
        </div>
        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {tags.map(t => (
              <span key={t} className="text-[9px] font-bold px-2 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4] flex items-center gap-1">
                #{t}
                <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}><X size={10} /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <button type="submit" className="neo-button px-6 py-2 text-sm bg-[#F7E8A4]">Save Entry</button>
        </div>
      </div>
    </form>
  );
}

function EntryCard({ entry, onDelete }: { entry: JournalEntry; onDelete: () => void }) {
  const mood = moodIcons[entry.mood];
  return (
    <NeoCard>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: mood.color }}>
          {mood.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-extrabold truncate">{entry.title}</h3>
          <div className="flex items-center gap-2 text-xs text-[#5C5C5C] font-medium">
            <span>{entry.date}</span>
            <span>·</span>
            <span>{mood.label}</span>
          </div>
        </div>
        <button onClick={onDelete} className="text-[#5C5C5C] hover:text-[#F8C8C8] transition-colors shrink-0"><X size={14} /></button>
      </div>
      <p className="text-sm text-[#5C5C5C] leading-relaxed whitespace-pre-wrap line-clamp-4">{entry.content}</p>
      {entry.tags.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {entry.tags.map(tag => (
            <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4]">#{tag}</span>
          ))}
        </div>
      )}
    </NeoCard>
  );
}

export default function JournalPage() {
  const journalEntries = useLifeStore(s => s.journalEntries);
  const deleteEntry = useLifeStore(s => s.deleteEntry);
  const [showNew, setShowNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  const months = useMemo(() => {
    const set = new Set<string>();
    journalEntries.forEach(e => {
      try {
        set.add(format(parse(e.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM'));
      } catch {}
    });
    return Array.from(set).sort().reverse();
  }, [journalEntries]);

  const filtered = useMemo(() => {
    let result = journalEntries;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.content.toLowerCase().includes(q) ||
        e.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (selectedMonth) {
      result = result.filter(e => e.date.startsWith(selectedMonth));
    }
    return result;
  }, [journalEntries, searchQuery, selectedMonth]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <PageHeader title="Journal" description="Your personal diary for thoughts and reflections" icon={<NotebookPen size={20} />} />
        <button onClick={() => setShowNew(!showNew)} className="neo-button px-4 py-2 text-sm bg-[#F7E8A4] flex items-center gap-2 whitespace-nowrap">
          <Plus size={16} /> {showNew ? 'Cancel' : 'New Entry'}
        </button>
      </div>

      <AnimatePresence>{showNew && <NewEntryForm onDone={() => setShowNew(false)} />}</AnimatePresence>

      {journalEntries.length > 0 && !showNew && (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5C5C]" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search entries by title, content, or tags..."
              className="neo-input text-sm pl-10 w-full"
            />
          </div>
          <div className="relative inline-flex">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5C5C5C] pointer-events-none z-10" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="rounded-xl border-[3px] border-[#2D2D2D] bg-[#FFFDF8] text-sm pl-9 pr-8 py-2 appearance-none cursor-pointer min-w-[160px] shadow-[2px_2px_0px_0px_var(--neo-shadow)] hover:shadow-[4px_4px_0px_0px_var(--neo-shadow)] hover:-translate-y-0.5 transition-all focus:outline-none focus:shadow-[4px_4px_0px_0px_var(--neo-shadow)]"
            >
              <option value="">All months</option>
              {months.map(m => {
                const d = parse(m, 'yyyy-MM', new Date());
                return (
                  <option key={m} value={m}>{format(d, 'MMMM yyyy')}</option>
                );
              })}
            </select>
          </div>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map(entry => (
              <motion.div key={entry.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                <EntryCard entry={entry} onDelete={() => deleteEntry(entry.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filtered.length === 0 && journalEntries.length > 0 && (
        <div className="text-center py-16">
          <Search size={40} className="mx-auto text-[#5C5C5C] mb-4" />
          <p className="text-lg font-extrabold mb-1">No matches found</p>
          <p className="text-sm text-[#5C5C5C] font-medium">Try a different search or filter</p>
        </div>
      )}

      {journalEntries.length === 0 && (
        <div className="text-center py-16">
          <NotebookPen size={48} className="mx-auto text-[#5C5C5C] mb-4" />
          <p className="text-lg font-extrabold mb-1">No entries yet</p>
          <p className="text-sm text-[#5C5C5C] font-medium">Start writing your first journal entry</p>
        </div>
      )}
    </div>
  );
}
