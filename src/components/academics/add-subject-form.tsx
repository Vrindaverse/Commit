'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useLifeStore, genId } from '@/store/use-store';

const colorOptions = ['#B8D8F8', '#CDEAC0', '#F8C8C8', '#DCCEF5', '#F7E8A4', '#FFD8BE'];

export default function AddSubjectForm({ onDone }: { onDone: () => void }) {
  const addSubject = useLifeStore(s => s.addSubject);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('#B8D8F8');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addSubject({
      id: genId(), name: name.trim(), code: code.trim() || '---',
      attendance: 100, assignments: [], grade: '-', color,
    });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="neo-card p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-1.5">
        <div className="flex items-center gap-2 flex-1">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Subject name..." className="neo-input flex-1 text-sm font-bold min-w-0" autoFocus />
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Code" className="neo-input w-20 text-xs py-1.5 shrink-0" />
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button type="submit" className="neo-button px-4 py-2 text-xs bg-[#CDEAC0] font-extrabold">Add</button>
          <button type="button" onClick={onDone} className="neo-button p-2 bg-[#FFFDF8]"><X size={14} /></button>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {colorOptions.map(c => (
          <button key={c} type="button" onClick={() => setColor(c)} className={`w-6 h-6 rounded-sm border-2 border-[#2D2D2D] ${color === c ? 'scale-110' : ''}`} style={{ backgroundColor: c }} />
        ))}
      </div>
    </form>
  );
}
