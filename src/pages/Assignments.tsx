import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Clock, BookOpen } from 'lucide-react';
import { useStore, type Difficulty } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

const diffColors: Record<Difficulty, string> = {
  easy: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  hard: 'bg-destructive/10 text-destructive',
};

export default function Assignments() {
  const { assignments, addAssignment, updateAssignment, deleteAssignment } = useStore();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', deadline: '', difficulty: 'medium' as Difficulty, notes: '', progress: 0 });

  const handleAdd = () => {
    if (!form.title.trim()) return;
    addAssignment(form);
    setForm({ title: '', subject: '', deadline: '', difficulty: 'medium', notes: '', progress: 0 });
    setShow(false);
  };

  const sorted = [...assignments].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-sm text-muted-foreground">Track deadlines and progress</p>
        </div>
        <Button onClick={() => setShow(!show)} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>

      {show && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-4 space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Assignment title" />
            <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" />
            <Input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes..." rows={2} />
          <Button onClick={handleAdd} size="sm" className="bg-primary text-primary-foreground">Save</Button>
        </motion.div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {sorted.map((a) => {
            const now = Date.now();
            const deadline = new Date(a.deadline).getTime();
            const totalMs = deadline - now;
            const daysLeft = Math.max(0, Math.ceil(totalMs / 86400000));
            const hoursLeft = Math.max(0, Math.ceil(totalMs / 3600000));

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{a.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3" /> {a.subject}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${diffColors[a.difficulty]}`}>{a.difficulty}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {daysLeft > 0 ? `${daysLeft}d ${hoursLeft % 24}h left` : <span className="text-destructive font-medium">Overdue!</span>}
                </div>

                {a.notes && <p className="text-xs text-muted-foreground bg-secondary/50 rounded-md p-2">{a.notes}</p>}

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{a.progress}%</span>
                  </div>
                  <Progress value={a.progress} className="h-1.5" />
                  <input
                    type="range" min={0} max={100} value={a.progress}
                    onChange={(e) => updateAssignment(a.id, { progress: Number(e.target.value) })}
                    className="w-full mt-1 accent-primary h-1"
                  />
                </div>

                <button onClick={() => deleteAssignment(a.id)} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
                  <Trash2 className="h-3 w-3" /> Remove
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {assignments.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No assignments yet. Add one above! 📚</div>
      )}
    </motion.div>
  );
}
