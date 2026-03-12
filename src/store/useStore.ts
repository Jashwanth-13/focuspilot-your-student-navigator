import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Priority = 'high' | 'medium' | 'low';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  difficulty: Difficulty;
  notes: string;
  progress: number;
}

export interface ScheduleEntry {
  id: string;
  subject: string;
  day: number; // 0-6
  startTime: string;
  endTime: string;
  color: string;
}

export interface StudySession {
  id: string;
  date: string;
  duration: number; // minutes
  type: 'pomodoro' | 'free';
}

export interface ReadingSpeed {
  subject: string;
  wpm: number;
}

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Assignments
  assignments: Assignment[];
  addAssignment: (a: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;

  // Schedule
  schedule: ScheduleEntry[];
  addScheduleEntry: (e: Omit<ScheduleEntry, 'id'>) => void;
  deleteScheduleEntry: (id: string) => void;

  // Study sessions
  sessions: StudySession[];
  addSession: (s: Omit<StudySession, 'id'>) => void;

  // Reading speeds
  readingSpeeds: ReadingSpeed[];
  setReadingSpeed: (subject: string, wpm: number) => void;

  // Streak
  studyDates: string[];
  markStudyDay: (date: string) => void;

  // Focus mode
  focusMode: boolean;
  setFocusMode: (v: boolean) => void;

  // Pomodoro settings
  pomodoroWork: number;
  pomodoroBreak: number;
  setPomodoroSettings: (work: number, brk: number) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((s) => {
        const next = !s.darkMode;
        document.documentElement.classList.toggle('dark', next);
        return { darkMode: next };
      }),

      tasks: [],
      addTask: (task) => set((s) => ({ tasks: [...s.tasks, { ...task, id: uid(), createdAt: new Date().toISOString() }] })),
      updateTask: (id, updates) => set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) })),
      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      assignments: [],
      addAssignment: (a) => set((s) => ({ assignments: [...s.assignments, { ...a, id: uid() }] })),
      updateAssignment: (id, updates) => set((s) => ({ assignments: s.assignments.map((a) => (a.id === id ? { ...a, ...updates } : a)) })),
      deleteAssignment: (id) => set((s) => ({ assignments: s.assignments.filter((a) => a.id !== id) })),

      schedule: [],
      addScheduleEntry: (e) => set((s) => ({ schedule: [...s.schedule, { ...e, id: uid() }] })),
      deleteScheduleEntry: (id) => set((s) => ({ schedule: s.schedule.filter((e) => e.id !== id) })),

      sessions: [],
      addSession: (s2) => set((s) => ({ sessions: [...s.sessions, { ...s2, id: uid() }] })),

      readingSpeeds: [],
      setReadingSpeed: (subject, wpm) => set((s) => {
        const existing = s.readingSpeeds.find((r) => r.subject === subject);
        if (existing) return { readingSpeeds: s.readingSpeeds.map((r) => (r.subject === subject ? { ...r, wpm } : r)) };
        return { readingSpeeds: [...s.readingSpeeds, { subject, wpm }] };
      }),

      studyDates: [],
      markStudyDay: (date) => set((s) => ({
        studyDates: s.studyDates.includes(date) ? s.studyDates : [...s.studyDates, date],
      })),

      focusMode: false,
      setFocusMode: (v) => set({ focusMode: v }),

      pomodoroWork: 25,
      pomodoroBreak: 5,
      setPomodoroSettings: (work, brk) => set({ pomodoroWork: work, pomodoroBreak: brk }),
    }),
    { name: 'focusflow-storage' }
  )
);
