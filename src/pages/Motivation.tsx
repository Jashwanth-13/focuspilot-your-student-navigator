import { motion } from 'framer-motion';
import { Heart, ExternalLink, Lightbulb, Rocket } from 'lucide-react';

const videos = [
  { title: 'How to Study Effectively', id: 'IlU-zDU6aQ0' },
  { title: 'The Pomodoro Technique', id: 'mNBmG24djoY' },
  { title: 'Building Good Habits', id: 'PZ7lDrwYdZc' },
];

const tips = [
  { icon: '🎯', title: 'Set Clear Goals', desc: 'Break big tasks into smaller, actionable steps.' },
  { icon: '⏰', title: 'Time Blocking', desc: 'Dedicate specific hours to specific subjects.' },
  { icon: '📵', title: 'Minimize Distractions', desc: 'Put your phone on DND during study sessions.' },
  { icon: '💤', title: 'Sleep Well', desc: '7-8 hours of sleep improves memory consolidation.' },
  { icon: '🏃', title: 'Exercise Regularly', desc: 'Physical activity boosts cognitive performance.' },
  { icon: '📝', title: 'Active Recall', desc: 'Test yourself instead of re-reading notes.' },
  { icon: '🔄', title: 'Spaced Repetition', desc: 'Review material at increasing intervals.' },
  { icon: '🧘', title: 'Take Breaks', desc: 'Regular breaks prevent burnout and improve focus.' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function Motivation() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="h-6 w-6 text-accent" /> Motivation
        </h1>
        <p className="text-sm text-muted-foreground">Stay inspired and productive</p>
      </div>

      {/* Videos */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" /> Study Motivation Videos
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <motion.div key={v.id} variants={item} className="glass-card overflow-hidden">
              <div className="aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-foreground">{v.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-warning" /> Productivity Tips
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tips.map((tip) => (
            <motion.div key={tip.title} variants={item} className="glass-card p-4 hover:shadow-md transition-shadow">
              <span className="text-2xl mb-2 block">{tip.icon}</span>
              <h3 className="text-sm font-semibold text-foreground">{tip.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
