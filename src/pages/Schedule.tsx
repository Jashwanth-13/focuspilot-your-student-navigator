import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7am - 8pm
const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4', '#F97316'];

export default function Schedule() {
  const { schedule, addScheduleEntry, deleteScheduleEntry } = useStore();
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ subject: '', day: 0, startTime: '09:00', endTime: '10:00', color: COLORS[0] });

  const handleAdd = () => {
    if (!form.subject.trim()) return;
    addScheduleEntry(form);
    setForm({ subject: '', day: 0, startTime: '09:00', endTime: '10:00', color: COLORS[0] });
    setShow(false);
  };

  const getTop = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return ((h - 7) * 60 + m) * (60 / 60); // 60px per hour
  };

  const getHeight = (start: string, end: string) => {
    return getTop(end) - getTop(start);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Class Schedule</h1>
          <p className="text-sm text-muted-foreground">Your weekly timetable</p>
        </div>
        <Button onClick={() => setShow(!show)} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-1" /> Add Class
        </Button>
      </div>

      {/* Add form */}
      {show && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-4 space-y-3">
          <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject name" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select value={form.day} onChange={(e) => setForm({ ...form, day: Number(e.target.value) })} className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
            <Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            <Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            <div className="flex gap-1 items-center">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${form.color === c ? 'scale-125 border-foreground' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleAdd} size="sm" className="bg-primary text-primary-foreground">Save</Button>
        </motion.div>
      )}

      {/* Timetable grid */}
      <div className="glass-card overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header */}
          <div className="grid grid-cols-8 border-b border-border">
            <div className="p-2 text-xs font-medium text-muted-foreground">Time</div>
            {DAYS.map((d) => (
              <div key={d} className="p-2 text-xs font-medium text-center text-foreground">{d}</div>
            ))}
          </div>

          {/* Body */}
          <div className="relative grid grid-cols-8" style={{ height: `${14 * 60}px` }}>
            {/* Time labels */}
            <div className="relative">
              {HOURS.map((h) => (
                <div key={h} className="absolute left-0 right-0 text-xs text-muted-foreground px-2" style={{ top: `${(h - 7) * 60}px` }}>
                  {h}:00
                </div>
              ))}
            </div>

            {/* Day columns */}
            {DAYS.map((_, dayIdx) => (
              <div key={dayIdx} className="relative border-l border-border">
                {HOURS.map((h) => (
                  <div key={h} className="absolute left-0 right-0 border-t border-border/50" style={{ top: `${(h - 7) * 60}px` }} />
                ))}
                {schedule.filter((e) => e.day === dayIdx).map((entry) => (
                  <div
                    key={entry.id}
                    className="absolute left-0.5 right-0.5 rounded-md px-1.5 py-1 text-xs font-medium overflow-hidden group cursor-pointer"
                    style={{
                      top: `${getTop(entry.startTime)}px`,
                      height: `${Math.max(getHeight(entry.startTime, entry.endTime), 30)}px`,
                      backgroundColor: entry.color + '22',
                      borderLeft: `3px solid ${entry.color}`,
                      color: entry.color,
                    }}
                  >
                    <span className="block truncate">{entry.subject}</span>
                    <span className="text-[10px] opacity-70">{entry.startTime}-{entry.endTime}</span>
                    <button
                      onClick={() => deleteScheduleEntry(entry.id)}
                      className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
