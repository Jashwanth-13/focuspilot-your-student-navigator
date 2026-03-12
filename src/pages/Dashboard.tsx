import { motion } from 'framer-motion';
import { CheckSquare, Clock, Flame, TrendingUp, BookOpen, Target } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useMemo } from 'react';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const { tasks, sessions, assignments, studyDates } = useStore();

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTasks = tasks.filter((t) => t.createdAt.slice(0, 10) === todayStr);
  const completedToday = todayTasks.filter((t) => t.completed).length;

  const todayMinutes = sessions
    .filter((s) => s.date.slice(0, 10) === todayStr)
    .reduce((sum, s) => sum + s.duration, 0);

  const upcomingAssignments = assignments
    .filter((a) => new Date(a.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  // Streak
  const currentStreak = useMemo(() => {
    const sorted = [...studyDates].sort().reverse();
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      if (sorted.includes(ds)) streak++;
      else if (i > 0) break;
    }
    return streak;
  }, [studyDates]);

  // Productivity score
  const prodScore = Math.min(100, Math.round(
    (completedToday / Math.max(todayTasks.length, 1)) * 40 +
    Math.min(todayMinutes / 120, 1) * 40 +
    Math.min(currentStreak / 7, 1) * 20
  ));

  // Weekly chart data
  const weekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().slice(0, 10);
      const mins = sessions.filter((s) => s.date.slice(0, 10) === ds).reduce((s, x) => s + x.duration, 0);
      return { day: days[d.getDay()], minutes: mins };
    });
  }, [sessions]);

  const stats = [
    { label: "Today's Tasks", value: `${completedToday}/${todayTasks.length}`, icon: CheckSquare, color: 'text-primary' },
    { label: 'Study Time', value: `${todayMinutes}m`, icon: Clock, color: 'text-accent' },
    { label: 'Streak', value: `${currentStreak} days`, icon: Flame, color: 'text-warning' },
    { label: 'Productivity', value: `${prodScore}%`, icon: TrendingUp, color: 'text-success' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back! Here's your study overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={item} className="glass-card p-4 sm:p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly Chart */}
        <motion.div variants={item} className="glass-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Study Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(215, 16%, 47%)" />
              <Tooltip />
              <Area type="monotone" dataKey="minutes" stroke="hsl(221, 83%, 53%)" fill="url(#colorMin)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div variants={item} className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" /> Upcoming Deadlines
          </h3>
          {upcomingAssignments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming deadlines 🎉</p>
          ) : (
            <div className="space-y-3">
              {upcomingAssignments.map((a) => {
                const daysLeft = Math.ceil((new Date(a.deadline).getTime() - Date.now()) / 86400000);
                return (
                  <div key={a.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.subject}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      daysLeft <= 1 ? 'bg-destructive/10 text-destructive' :
                      daysLeft <= 3 ? 'bg-warning/10 text-warning' :
                      'bg-success/10 text-success'
                    }`}>
                      {daysLeft}d left
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
