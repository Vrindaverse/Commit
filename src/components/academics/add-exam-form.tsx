'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useLifeStore, genId } from '@/store/use-store';

const colorOptions = ['#B8D8F8', '#CDEAC0', '#F8C8C8', '#DCCEF5', '#F7E8A4', '#FFD8BE'];

export default function AddExamForm({ onDone }: { onDone: () => void }) {
  const addExam = useLifeStore(s => s.addExam);
  const subjects = useLifeStore(s => s.subjects);
  const [subject, setSubject] = useState<string>(subjects[0]?.name ?? '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [color, setColor] = useState('#F7E8A4');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !date) return;
    addExam({
      id: genId(), subject: subject.trim(), date, time: time.trim() || '',
      syllabus: syllabus.trim() ? syllabus.split(',').map(s => s.trim()).filter(Boolean) : [],
      color,
    });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="neo-card p-4 mb-6">
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center gap-2">
          <select value={subject} onChange={e => setSubject(e.target.value)} className="neo-input flex-1 text-sm font-bold">
            {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <button type="submit" className="neo-button px-4 py-2 text-xs bg-[#CDEAC0] font-extrabold">Add</button>
          <button type="button" onClick={onDone} className="neo-button p-2 bg-[#FFFDF8]"><X size={14} /></button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="neo-input flex-1 text-xs" />
          <input type="time" value={time} onChange={e => setTime(e.target.value)} className="neo-input flex-1 text-xs" />
        </div>
        <input value={syllabus} onChange={e => setSyllabus(e.target.value)} placeholder="Syllabus (comma separated)..." className="neo-input text-xs" />
      </div>
      <div className="flex items-center gap-1.5">
        {colorOptions.map(c => (
          <button key={c} type="button" onClick={() => setColor(c)} className={`w-6 h-6 rounded-sm border-2 border-[#2D2D2D] ${color === c ? 'scale-110' : ''}`} style={{ backgroundColor: c }} />
        ))}
      </div>
    </form>
  );
}
