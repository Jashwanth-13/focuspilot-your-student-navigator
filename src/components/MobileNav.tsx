import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Zap, LayoutDashboard, CheckSquare, Calendar, FileText, Timer, BookOpen, Heart, Sun, Moon, Focus } from 'lucide-react';
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

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { darkMode, toggleDarkMode, focusMode, setFocusMode } = useStore();
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card/90 backdrop-blur px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="gradient-primary rounded-lg p-1.5">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold gradient-text">FocusFlow</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-foreground">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur pt-16 p-4 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              <div className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium ${location.pathname === to ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                <Icon className="h-4 w-4" /> {label}
              </div>
            </NavLink>
          ))}
          <div className="border-t border-border my-2 pt-2 space-y-1">
            <button onClick={() => { setFocusMode(!focusMode); setOpen(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground">
              <Focus className="h-4 w-4" /> Focus Mode
            </button>
            <button onClick={() => { toggleDarkMode(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {darkMode ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>
      )}
    </>
  );
}
