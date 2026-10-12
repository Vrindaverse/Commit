'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, CheckCircle2, Circle, ChevronDown, ChevronUp, Clock, Plus, X, Save, Globe, PenTool, Brain, Tag } from 'lucide-react';
import NeoCard from '@/components/shared/neo-card';
import ProgressBar from '@/components/shared/progress-bar';
import PageHeader from '@/components/shared/page-header';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useLifeStore, genId } from '@/store/use-store';
import { Project, TaskStatus } from '@/types';

const projectIcons: Record<string, React.ReactNode> = {
  Safar: <Globe size={24} />,
  Akshar: <PenTool size={24} />,
  NeuralNetwork: <Brain size={24} />,
};

const allColors = ['#B8D8F8', '#CDEAC0', '#F7E8A4', '#FFD8BE', '#F8C8C8', '#DCCEF5'];

function statusBadge(status: string) {
  if (status === 'done') return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#CDEAC0] border-[2px] border-[#2D2D2D]">Done</span>;
  if (status === 'in-progress') return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#B8D8F8] border-[2px] border-[#2D2D2D]">In Progress</span>;
  return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#F0ECE4] border-[2px] border-[#2D2D2D]">Todo</span>;
}

function ProjectEditDialog({ project, open, onOpenChange }: { project: Project; open: boolean; onOpenChange: (v: boolean) => void }) {
  const updateProject = useLifeStore(s => s.updateProject);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [color, setColor] = useState(project.color);

  const handleSave = () => {
    if (!title.trim()) return;
    updateProject(project.id, { title: title.trim(), description: description.trim(), color });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="neo-card !p-5 !shadow-[6px_6px_0px_0px_var(--neo-shadow)] !border-[3px] !border-[#2D2D2D] !rounded-[20px] !ring-0 max-w-md">
        <DialogTitle className="text-base font-extrabold mb-4">Edit Project</DialogTitle>
        <div className="space-y-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title" className="neo-input w-full text-sm font-bold" autoFocus />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className="neo-input w-full text-xs" />
          <div className="flex gap-2 items-center">
            <span className="text-[10px] font-bold text-[#5C5C5C]">Color:</span>
            {allColors.map(c => (
              <button key={c} type="button" onClick={() => setColor(c)} className={`w-6 h-6 rounded-full border-[3px] border-[#2D2D2D] transition-all ${color === c ? 'scale-110 shadow-[2px_2px_0px_0px_var(--neo-shadow)]' : ''}`} style={{ backgroundColor: c }} />
            ))}
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

function AddProjectForm({ onDone }: { onDone: () => void }) {
  const addProject = useLifeStore(s => s.addProject);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(allColors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addProject({
      id: genId(),
      title: title.trim(),
      description: description.trim(),
      progress: 0,
      tasks: [],
      milestones: [],
      color,
    });
    onDone();
  };

  return (
    <form onSubmit={handleSubmit} className="neo-card p-5 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold">New Project</h3>
        <button type="button" onClick={onDone} className="neo-button p-1.5 bg-[#FFFDF8]"><X size={14} /></button>
      </div>
      <div className="space-y-3">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title..." className="neo-input w-full text-sm font-bold" autoFocus required />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description..." className="neo-input w-full text-xs" />
        <div className="flex gap-2 items-center">
          <span className="text-[10px] font-bold text-[#5C5C5C]">Color:</span>
          {allColors.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)} className={`w-6 h-6 rounded-full border-[3px] border-[#2D2D2D] transition-all ${color === c ? 'scale-110 shadow-[2px_2px_0px_0px_var(--neo-shadow)]' : ''}`} style={{ backgroundColor: c }} />
          ))}
        </div>
        <button type="submit" className="neo-button px-5 py-2 text-xs bg-[#B8D8F8] font-extrabold">Create Project</button>
      </div>
    </form>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
}

function ProjectCard({ project, index, expandedId, onToggleExpand }: ProjectCardProps) {
  const deleteProject = useLifeStore(s => s.deleteProject);
  const addProjectTask = useLifeStore(s => s.addProjectTask);
  const deleteProjectTask = useLifeStore(s => s.deleteProjectTask);
  const updateProjectTask = useLifeStore(s => s.updateProjectTask);
  const addProjectMilestone = useLifeStore(s => s.addProjectMilestone);
  const deleteProjectMilestone = useLifeStore(s => s.deleteProjectMilestone);
  const toggleProjectMilestone = useLifeStore(s => s.toggleProjectMilestone);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDue, setNewTaskDue] = useState(new Date().toISOString().split('T')[0]);
  const [newMilestone, setNewMilestone] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const isExpanded = expandedId === project.id;

  const completedTasks = project.tasks.filter(t => t.status === 'done').length;
  const completedMilestones = project.milestones.filter(m => m.completed).length;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addProjectTask(project.id, {
      id: genId(),
      title: newTaskTitle.trim(),
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: newTaskDue,
      tags: [],
    });
    setNewTaskTitle('');
    setNewTaskDue(new Date().toISOString().split('T')[0]);
  };

  const handleAddMilestone = () => {
    if (!newMilestone.trim()) return;
    addProjectMilestone(project.id, newMilestone.trim());
    setNewMilestone('');
  };

  const cycleTaskStatus = (taskId: string, current: string) => {
    const next: Record<string, string> = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' };
    updateProjectTask(project.id, taskId, { status: next[current] as TaskStatus });
  };

  return (
    <>
      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
        <NeoCard color={project.color}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl border-[3px] border-[#2D2D2D] flex items-center justify-center shrink-0" style={{ backgroundColor: project.color }}>
              {projectIcons[project.title] || <Rocket size={24} />}
            </div>
            <div onClick={() => onToggleExpand(project.id)} onKeyDown={e => e.key === 'Enter' && onToggleExpand(project.id)} role="button" tabIndex={0} className="flex-1 min-w-0 text-left cursor-pointer">
              <h2 className="text-lg font-extrabold truncate">{project.title}</h2>
              <p className="text-xs text-[#5C5C5C] font-medium truncate">{project.description}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => deleteProject(project.id)} className="neo-button p-1.5 bg-[#FFFDF8] text-[#5C5C5C] hover:text-[#F8C8C8]"><X size={14} /></button>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-sm font-extrabold">Progress</span>
              <span className="text-sm font-extrabold text-[#5C5C5C]">{project.progress}%</span>
            </div>
            <ProgressBar value={project.progress} color={project.color} />
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-[#5C5C5C] mb-3">
            <span>Tasks: {completedTasks}/{project.tasks.length}</span>
            <span>Milestones: {completedMilestones}/{project.milestones.length}</span>
          </div>

          <button
            onClick={() => onToggleExpand(project.id)}
            className="flex items-center gap-1 text-xs font-bold text-[#5C5C5C] hover:text-[#2A2A2A] transition-colors"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {isExpanded ? 'Hide Details' : 'View Details'}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t-[2px] border-[#2D2D2D] space-y-5">
                  <div className="flex justify-end">
                    <button onClick={() => setEditDialogOpen(true)} className="neo-button px-3 py-1.5 text-[10px] bg-[#FFFDF8] font-extrabold">Edit Project</button>
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold mb-3">Milestones</h4>
                    <div className="space-y-2 mb-3">
                      {project.milestones.map(m => (
                        <div key={m.id} className="flex items-center gap-2 group">
                          <button onClick={() => toggleProjectMilestone(project.id, m.id)} className="shrink-0">
                            {m.completed ? <CheckCircle2 size={16} className="text-[#CDEAC0]" /> : <Circle size={16} className="text-[#5C5C5C]" />}
                          </button>
                          <span className={`text-xs font-medium flex-1 ${m.completed ? 'line-through text-[#5C5C5C]' : ''}`}>{m.title}</span>
                          <button onClick={() => deleteProjectMilestone(project.id, m.id)} className="opacity-0 group-hover:opacity-100 text-[#5C5C5C] hover:text-[#F8C8C8] transition-all shrink-0"><X size={12} /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddMilestone()} placeholder="Add milestone..." className="neo-input flex-1 text-xs py-1.5" />
                      <button onClick={handleAddMilestone} className="neo-button p-2 bg-[#F7E8A4]"><Plus size={14} /></button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-extrabold">Tasks</h4>
                      <button onClick={() => setShowNewTask(!showNewTask)} className="neo-button px-2.5 py-1 text-[10px] bg-[#B8D8F8] font-extrabold flex items-center gap-1"><Plus size={12} /> Add Task</button>
                    </div>
                    <div className="space-y-2">
                      {project.tasks.map(t => (
                        <div key={t.id} className="flex items-center gap-2 p-2.5 rounded-xl border-[2px] border-[#2D2D2D] bg-[#FFFDF8] group">
                          <button onClick={() => cycleTaskStatus(t.id, t.status)} className="shrink-0">
                            <div className={`w-4 h-4 rounded-full border-[2px] border-[#2D2D2D] ${t.status === 'done' ? 'bg-[#CDEAC0]' : t.status === 'in-progress' ? 'bg-[#B8D8F8]' : ''}`} />
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-medium ${t.status === 'done' ? 'line-through text-[#5C5C5C]' : ''}`}>{t.title}</span>
                              {statusBadge(t.status)}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1 text-[10px] text-[#5C5C5C]"><Clock size={10} />{t.dueDate}</span>
                              {t.tags.length > 0 && (
                                <span className="flex items-center gap-1 text-[10px] text-[#5C5C5C]"><Tag size={10} />{t.tags.join(', ')}</span>
                              )}
                            </div>
                          </div>
                          <button onClick={() => deleteProjectTask(project.id, t.id)} className="opacity-0 group-hover:opacity-100 text-[#5C5C5C] hover:text-[#F8C8C8] transition-all shrink-0"><X size={14} /></button>
                        </div>
                      ))}
                    </div>

                    <AnimatePresence>
                      {showNewTask && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex gap-2 mt-3 overflow-hidden">
                          <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddTask()} placeholder="Task title..." className="neo-input flex-1 text-xs py-1.5" autoFocus />
                          <input type="date" value={newTaskDue} onChange={e => setNewTaskDue(e.target.value)} className="neo-input text-xs py-1.5 w-36" />
                          <button onClick={handleAddTask} className="neo-button px-3 py-1.5 text-xs bg-[#B8D8F8] font-extrabold">Add</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </NeoCard>
      </motion.div>

      <ProjectEditDialog project={project} open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </>
  );
}

export default function ProjectsPage() {
  const projects = useLifeStore(s => s.projects);
  const [showNew, setShowNew] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <PageHeader title="Projects" description="Active projects and their progress" icon={<Rocket size={20} />} />
        <button onClick={() => setShowNew(!showNew)} className="neo-button px-4 py-2 text-sm bg-[#B8D8F8] flex items-center gap-2 whitespace-nowrap">
          <Plus size={16} /> {showNew ? 'Cancel' : 'New Project'}
        </button>
      </div>

      <AnimatePresence>{showNew && <AddProjectForm onDone={() => setShowNew(false)} />}</AnimatePresence>

      {projects.length === 0 && (
        <div className="text-center py-16">
          <Rocket size={48} className="mx-auto text-[#5C5C5C] mb-4" />
          <p className="text-lg font-extrabold mb-1">No projects yet</p>
          <p className="text-sm text-[#5C5C5C] font-medium">Create your first project to get started</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} expandedId={expandedId} onToggleExpand={handleToggleExpand} />
        ))}
      </div>
    </div>
  );
}