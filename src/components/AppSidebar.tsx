import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CheckSquare, Calendar, FileText, Timer,
  BookOpen, Flame, Heart, Focus, Sun, Moon, Zap
} from 'lucide-react';
import { useStore } from '@/store/useStore';

const links = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/schedule', icon: Calendar, label: 'Schedule' },
  { to: '/assignments', icon: FileText, label: 'Assignments' },
  { to: '/timer', icon: Timer, label: 'Pomodoro' },
  { to: '/reader', icon: BookOpen, label: 'Reader' },
  { to: '/motivation', icon: Heart, label: 'Motivation' },
];

export default function AppSidebar() {
  const { darkMode, toggleDarkMode, focusMode, setFocusMode } = useStore();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
        <div className="gradient-primary rounded-lg p-2">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold gradient-text">FocusFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <NavLink key={to} to={to}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-border p-3 space-y-2">
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            focusMode ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          <Focus className="h-4 w-4" />
          Focus Mode
        </button>
        <button
          onClick={toggleDarkMode}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </aside>
  );
}
