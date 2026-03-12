import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Coffee, Brain } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TimerPage() {
  const { pomodoroWork, pomodoroBreak, setPomodoroSettings, addSession, markStudyDay } = useStore();
  const [isWork, setIsWork] = useState(true);
  const [seconds, setSeconds] = useState(pomodoroWork * 60);
  const [running, setRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workMin, setWorkMin] = useState(pomodoroWork);
  const [breakMin, setBreakMin] = useState(pomodoroBreak);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const startTimeRef = useRef<number>(0);

  const totalSeconds = isWork ? pomodoroWork * 60 : pomodoroBreak * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  const reset = useCallback(() => {
    setRunning(false);
    setSeconds(isWork ? pomodoroWork * 60 : pomodoroBreak * 60);
  }, [isWork, pomodoroWork, pomodoroBreak]);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          if (isWork) {
            const duration = pomodoroWork;
            addSession({ date: new Date().toISOString(), duration, type: 'pomodoro' });
            markStudyDay(new Date().toISOString().slice(0, 10));
            setSessionsCompleted((c) => c + 1);
            setIsWork(false);
            return pomodoroBreak * 60;
          } else {
            setIsWork(true);
            return pomodoroWork * 60;
          }
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, isWork, pomodoroWork, pomodoroBreak, addSession, markStudyDay]);

  const saveSettings = () => {
    setPomodoroSettings(workMin, breakMin);
    setShowSettings(false);
    setSeconds(isWork ? workMin * 60 : breakMin * 60);
    setRunning(false);
  };

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pomodoro Timer</h1>
          <p className="text-sm text-muted-foreground">Stay focused, take breaks</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {showSettings && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Work (min)</label>
              <Input type="number" value={workMin} onChange={(e) => setWorkMin(Number(e.target.value))} min={1} max={120} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Break (min)</label>
              <Input type="number" value={breakMin} onChange={(e) => setBreakMin(Number(e.target.value))} min={1} max={60} />
            </div>
          </div>
          <Button onClick={saveSettings} size="sm" className="bg-primary text-primary-foreground">Save</Button>
        </motion.div>
      )}

      {/* Timer circle */}
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative">
          <svg width="280" height="280" className="-rotate-90">
            <circle cx="140" cy="140" r="120" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
            <circle
              cx="140" cy="140" r="120" fill="none"
              stroke={isWork ? 'hsl(var(--primary))' : 'hsl(var(--success))'}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 mb-2">
              {isWork ? <Brain className="h-5 w-5 text-primary" /> : <Coffee className="h-5 w-5 text-success" />}
              <span className="text-sm font-medium text-muted-foreground">{isWork ? 'Focus' : 'Break'}</span>
            </div>
            <span className="text-5xl font-bold tabular-nums text-foreground">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <Button
            onClick={() => { setRunning(!running); if (!running) startTimeRef.current = Date.now(); }}
            size="lg"
            className={`rounded-full px-8 ${isWork ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-success text-success-foreground hover:bg-success/90'}`}
          >
            {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button onClick={reset} variant="outline" size="lg" className="rounded-full">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-4">Sessions completed: {sessionsCompleted}</p>
      </div>
    </motion.div>
  );
}
