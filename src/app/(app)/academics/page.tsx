'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Calendar, ClipboardList, TrendingUp, Clock, Plus, X, Trash2 } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import ProgressBar from '@/components/shared/progress-bar';
import PageHeader from '@/components/shared/page-header';
import { useLifeStore, genId } from '@/store/use-store';
import { Subject, Exam } from '@/types';

const colorOptions = ['#B8D8F8', '#CDEAC0', '#F8C8C8', '#DCCEF5', '#F7E8A4', '#FFD8BE'];

function AddSubjectForm({ onDone }: { onDone: () => void }) {
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
      <div className="flex gap-1.5">
        {colorOptions.map(c => (
          <button key={c} type="button" onClick={() => setColor(c)}
            className={`w-5 h-5 rounded-lg border-[2px] border-[#2D2D2D] ${color === c ? 'ring-[3px] ring-[#2D2D2D]' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </form>
  );
}

function AddExamForm({ onDone }: { onDone: () => void }) {
  const addExam = useLifeStore(s => s.addExam);
  const subjects = useLifeStore(s => s.subjects);
  const [subject, setSubject] = useState(subjects[0]?.name || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [syllabus, setSyllabus] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !date) return;
    addExam({
      id: genId(), subject: subject.trim(), date, time: time.trim(),
      syllabus: syllabus.split(',').map(s => s.trim()).filter(Boolean),
      color: subjects.find(s => s.name === subject)?.color || '#B8D8F8',
    });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="neo-card p-4">
      <div className="flex items-center gap-2 mb-3">
        {subjects.length > 0 ? (
          <select value={subject} onChange={e => setSubject(e.target.value)} className="neo-input flex-1 text-xs py-1.5 font-bold">
            {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        ) : (
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject..." className="neo-input flex-1 text-xs py-1.5 font-bold" />
        )}
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="neo-input text-xs py-1.5 w-28" />
        <button type="submit" className="neo-button px-3 py-1.5 text-xs bg-[#F8C8C8] font-extrabold">Add</button>
        <button type="button" onClick={onDone} className="neo-button p-1.5 bg-[#FFFDF8]"><X size={14} /></button>
      </div>
      <div className="flex gap-2">
        <input value={time} onChange={e => setTime(e.target.value)} placeholder="Time (e.g. 10:00 AM)" className="neo-input flex-1 text-xs py-1.5" />
        <input value={syllabus} onChange={e => setSyllabus(e.target.value)} placeholder="Topics (comma-separated)" className="neo-input flex-1 text-xs py-1.5" />
      </div>
    </form>
  );
}

function SubjectModal({ subjectId, onClose }: { subjectId: string; onClose: () => void }) {
  const subject = useLifeStore(s => s.subjects.find(sub => sub.id === subjectId));
  const deleteSubject = useLifeStore(s => s.deleteSubject);
  const updateSubject = useLifeStore(s => s.updateSubject);
  const toggleAssignment = useLifeStore(s => s.toggleAssignment);
  const addAssignment = useLifeStore(s => s.addAssignment);
  const [newAss, setNewAss] = useState('');
  const [newDue, setNewDue] = useState('');
  const [editingAtt, setEditingAtt] = useState(false);
  const [attVal, setAttVal] = useState('');

  const handleDelete = () => {
    if (subject) deleteSubject(subject.id);
    onClose();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!subject) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2D2D]/60 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg"
      >
        <NeoCard color={subject.color}>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: subject.color }}>
              <GraduationCap size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold truncate">{subject.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#FFFDF8] inline-block mt-0.5">{subject.code}</span>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-bold text-[#5C5C5C]">Attendance</span>
              {editingAtt ? (
                <input value={attVal} onChange={e => setAttVal(e.target.value)}
                  onBlur={() => { const v = Math.min(100, Math.max(0, Number(attVal) || 0)); updateSubject(subject.id, { attendance: v }); setEditingAtt(false); }}
                  onKeyDown={e => { if (e.key === 'Enter') { const v = Math.min(100, Math.max(0, Number(attVal) || 0)); updateSubject(subject.id, { attendance: v }); setEditingAtt(false); } }}
                  className="neo-input w-16 text-sm font-bold text-center py-0.5" autoFocus />
              ) : (
                <button onClick={() => { setEditingAtt(true); setAttVal(String(subject.attendance)); }} className="text-sm font-bold hover:text-[#5C5C5C] transition-colors">
                  {subject.attendance}%
                </button>
              )}
            </div>
            <ProgressBar value={editingAtt ? Math.min(100, Math.max(0, Number(attVal) || 0)) : subject.attendance} color={subject.color} height={10} showLabel={false} />
          </div>

          <div className="mb-5">
            <div className="flex items-center gap-1 text-sm font-bold text-[#5C5C5C] mb-2">
              <ClipboardList size={14} />
              <span>Assignments ({subject.assignments.filter(a => a.submitted).length}/{subject.assignments.length})</span>
            </div>
            <div className="space-y-2">
              {subject.assignments.length === 0 && (
                <p className="text-xs text-[#5C5C5C] font-medium py-2">No assignments yet</p>
              )}
              {subject.assignments.map((a, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <button onClick={() => toggleAssignment(subject.id, i)}>
                    <div className={`w-4 h-4 rounded-full border-[2px] border-[#2D2D2D] ${a.submitted ? 'bg-[#CDEAC0]' : ''} transition-colors`} />
                  </button>
                  <span className={`flex-1 font-medium ${a.submitted ? 'line-through text-[#5C5C5C]' : ''}`}>{a.title}</span>
                  <span className="text-xs text-[#5C5C5C]">{a.due || 'No due date'}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <input value={newAss} onChange={e => setNewAss(e.target.value)} placeholder="Add assignment..." className="neo-input flex-1 text-xs py-1.5" />
              <input type="date" value={newDue} onChange={e => setNewDue(e.target.value)} className="neo-input text-xs py-1.5 w-28" />
              <button onClick={() => { if (newAss.trim()) { addAssignment(subject.id, newAss.trim(), newDue); setNewAss(''); setNewDue(''); } }} className="neo-button px-3 py-1.5 text-xs bg-[#B8D8F8] font-extrabold"><Plus size={12} /></button>
            </div>
          </div>

          <button onClick={handleDelete} className="neo-button w-full py-2 text-xs bg-[#F8C8C8] font-extrabold flex items-center justify-center gap-2">
            <Trash2 size={12} /> Delete Subject
          </button>
        </NeoCard>
      </motion.div>
    </motion.div>
  );
}

function SubjectCard({ subject, index, onSelect }: { subject: Subject; index: number; onSelect: (s: Subject) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <div onClick={() => onSelect(subject)} onKeyDown={e => e.key === 'Enter' && onSelect(subject)} role="button" tabIndex={0} className="w-full text-left cursor-pointer">
        <NeoCard color={subject.color}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: subject.color }}>
              <GraduationCap size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-extrabold truncate">{subject.name}</h3>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#F0ECE4]">{subject.code}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5C5C5C]">Attendance</span>
            <span className="text-xs font-bold">{subject.attendance}%</span>
          </div>
          <div className="mt-1">
            <ProgressBar value={subject.attendance} color={subject.color} height={8} showLabel={false} />
          </div>
        </NeoCard>
      </div>
    </motion.div>
  );
}

function ExamCard({ exam, index, isLast }: { exam: Exam; index: number; isLast: boolean }) {
  const updateExam = useLifeStore(s => s.updateExam);
  const deleteExam = useLifeStore(s => s.deleteExam);

  const now = new Date();
  const daysUntil = Math.ceil((new Date(exam.date).getTime() - now.getTime()) / 86400000);

  const [editing, setEditing] = useState(false);
  const [editSubject, setEditSubject] = useState(exam.subject);
  const [editDate, setEditDate] = useState(exam.date);
  const [editTime, setEditTime] = useState(exam.time);
  const [editSyllabus, setEditSyllabus] = useState(exam.syllabus.join(', '));

  const saveEdit = () => {
    updateExam(exam.id, {
      subject: editSubject.trim(),
      date: editDate,
      time: editTime,
      syllabus: editSyllabus.split(',').map(s => s.trim()).filter(Boolean),
    });
    setEditing(false);
  };

  if (editing) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="neo-card p-3 mb-3">
        <div className="space-y-2">
          <div className="flex gap-2">
            <input value={editSubject} onChange={e => setEditSubject(e.target.value)} className="neo-input flex-1 text-xs py-1 font-bold" placeholder="Subject" />
            <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="neo-input text-xs py-1 w-28" />
          </div>
          <div className="flex gap-2">
            <input value={editTime} onChange={e => setEditTime(e.target.value)} className="neo-input flex-1 text-xs py-1" placeholder="Time (e.g. 10:00 AM)" />
            <input value={editSyllabus} onChange={e => setEditSyllabus(e.target.value)} className="neo-input flex-1 text-xs py-1" placeholder="Topics (comma-separated)" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={saveEdit} className="neo-button px-3 py-1 text-xs bg-[#CDEAC0] font-extrabold">Save</button>
            <button onClick={() => setEditing(false)} className="neo-button px-3 py-1 text-xs bg-[#FFFDF8] font-extrabold">Cancel</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}>
      <div className="flex gap-3 group">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full border-[2px] border-[#2D2D2D]" style={{ backgroundColor: daysUntil <= 7 ? '#F8C8C8' : exam.color }} />
          {!isLast && <div className="w-[2px] flex-1 bg-[#2D2D2D] my-1" />}
        </div>
        <div className="flex-1 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-extrabold">{exam.subject}</h4>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D]" style={{ backgroundColor: exam.color }}>
              {exam.date}
            </span>
            {daysUntil <= 7 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#F8C8C8]">
                {daysUntil === 0 ? 'Today!' : `${daysUntil}d left`}
              </span>
            )}
            {daysUntil > 7 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#FFFDF8]">
                {daysUntil}d away
              </span>
            )}
          </div>
          {exam.time ? (
            <div className="flex items-center gap-1 text-xs text-[#5C5C5C] font-medium mt-1">
              <Clock size={10} /> {exam.time}
            </div>
          ) : null}
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {exam.syllabus.map((topic, j) => (
              <span key={j} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full border-[2px] border-[#2D2D2D] bg-[#FFFDF8]">{topic}</span>
            ))}
          </div>
          <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => { setEditing(true); setEditSubject(exam.subject); setEditDate(exam.date); setEditTime(exam.time); setEditSyllabus(exam.syllabus.join(', ')); }} className="text-[10px] font-bold text-[#5C5C5C] hover:text-[#2A2A2A] transition-colors">
              Edit
            </button>
            <button onClick={() => deleteExam(exam.id)} className="text-[10px] font-bold text-[#F8C8C8] hover:text-[#F8A0A0] transition-colors">
              Delete
            </button>
          </div>
        </div>
        {daysUntil <= 7 && daysUntil >= 0 && (
          <div className="flex flex-col items-center justify-center flex-shrink-0 w-12">
            <span className="text-xl font-extrabold">{daysUntil === 0 ? '!' : daysUntil}</span>
            <span className="text-[8px] font-bold text-[#5C5C5C] uppercase">{daysUntil === 0 ? 'due' : 'days'}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ExamTimeline() {
  const exams = useLifeStore(s => s.exams);
  const [showAdd, setShowAdd] = useState(false);

  const now = new Date();
  const sorted = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcoming = sorted.filter(e => new Date(e.date) >= now);

  return (
    <NeoCard color="#F7E8A4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Calendar size={18} />
          <h2 className="text-lg font-extrabold">Upcoming Exams</h2>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="neo-button p-1.5 bg-[#FFFDF8]"><Plus size={14} /></button>
      </div>

      <AnimatePresence>{showAdd && <AddExamForm onDone={() => setShowAdd(false)} />}</AnimatePresence>

      {upcoming.length === 0 ? (
        <p className="text-xs text-[#5C5C5C] font-medium py-6 text-center">No exams scheduled</p>
      ) : (
        <div className="space-y-1">
          {upcoming.map((exam, i) => (
            <ExamCard key={exam.id} exam={exam} index={i} isLast={i === upcoming.length - 1} />
          ))}
        </div>
      )}
    </NeoCard>
  );
}

export default function AcademicsPage() {
  const subjects = useLifeStore(s => s.subjects);
  const [showAdd, setShowAdd] = useState(false);
  const [modalSubjectId, setModalSubjectId] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title="Academics" description="Track your courses, assignments, and exams" icon={<GraduationCap size={20} />} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold flex items-center gap-2"><TrendingUp size={20} />Subjects</h2>
            <button onClick={() => setShowAdd(!showAdd)} className="neo-button px-3 py-1.5 text-xs bg-[#F7E8A4] font-extrabold flex items-center gap-1"><Plus size={12} /> Add Subject</button>
          </div>

          <AnimatePresence>{showAdd && <AddSubjectForm onDone={() => setShowAdd(false)} />}</AnimatePresence>

          {subjects.length === 0 ? (
            <div className="text-center py-16">
              <GraduationCap size={48} className="mx-auto text-[#5C5C5C] mb-4" />
              <p className="text-lg font-extrabold mb-1">No subjects yet</p>
              <p className="text-sm text-[#5C5C5C] font-medium">Add your first subject to start tracking</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {subjects.map((subject, i) => (
                <SubjectCard key={subject.id} subject={subject} index={i} onSelect={(s) => setModalSubjectId(s.id)} />
              ))}
            </div>
          )}
        </div>
        <div className="space-y-6">
          <ExamTimeline />
        </div>
      </div>

      <AnimatePresence>
        {modalSubjectId && <SubjectModal key={modalSubjectId} subjectId={modalSubjectId} onClose={() => setModalSubjectId(null)} />}
      </AnimatePresence>
    </div>
  );
}
