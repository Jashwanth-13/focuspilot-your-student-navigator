import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, Flag } from 'lucide-react';
import { useStore, type Priority } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

const priorityConfig: Record<Priority, { label: string; color: string; icon: string }> = {
  high: { label: 'High', color: 'text-destructive', icon: '🔴' },
  medium: { label: 'Medium', color: 'text-warning', icon: '🟡' },
  low: { label: 'Low', color: 'text-success', icon: '🟢' },
};

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useStore();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const completed = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;

  const handleAdd = () => {
    if (!title.trim()) return;
    addTask({ title: title.trim(), completed: false, priority });
    setTitle('');
  };

  const handleEdit = (id: string) => {
    if (!editTitle.trim()) return;
    updateTask(id, { title: editTitle.trim() });
    setEditId(null);
  };

  const sorted = [...tasks].sort((a, b) => {
    const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return order[a.priority] - order[b.priority];
  });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Daily Tasks</h1>
        <p className="text-sm text-muted-foreground">{completed} of {tasks.length} completed</p>
      </div>

      {/* Progress */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-medium text-foreground">Progress</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Add task */}
      <div className="glass-card p-4">
        <div className="flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <div className="flex gap-1">
            {(['high', 'medium', 'low'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                  priority === p ? 'bg-primary/10 text-primary ring-1 ring-primary/30' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                {priorityConfig[p].icon}
              </button>
            ))}
          </div>
          <Button onClick={handleAdd} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        <AnimatePresence>
          {sorted.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="glass-card p-3 flex items-center gap-3"
            >
              <button onClick={() => updateTask(task.id, { completed: !task.completed })}>
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {editId === task.id ? (
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit(task.id)}
                  onBlur={() => handleEdit(task.id)}
                  className="flex-1 h-8"
                  autoFocus
                />
              ) : (
                <span
                  onClick={() => { setEditId(task.id); setEditTitle(task.title); }}
                  className={`flex-1 text-sm cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                >
                  {task.title}
                </span>
              )}

              <span className={`text-xs ${priorityConfig[task.priority].color}`}>
                <Flag className="h-3.5 w-3.5" />
              </span>
              <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No tasks yet. Add one above! ✨
          </div>
        )}
      </div>
    </motion.div>
  );
}
