import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import TimerPage from './TimerPage';
import Reader from './Reader';
import { X } from 'lucide-react';

export default function FocusPage() {
  const { setFocusMode } = useStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold gradient-text">Focus Mode</h1>
        <button
          onClick={() => { setFocusMode(false); navigate('/'); }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <TimerPage />
        <Reader />
      </div>
    </div>
  );
}
