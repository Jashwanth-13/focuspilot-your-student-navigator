import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Clock, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Reader() {
  const { readingSpeeds, setReadingSpeed } = useStore();
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [subject, setSubject] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [readingStarted, setReadingStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [measuredWpm, setMeasuredWpm] = useState<number | null>(null);

  const handleFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    if (file.name.endsWith('.txt')) {
      const text = await file.text();
      setContent(text);
      const wc = text.split(/\s+/).filter(Boolean).length;
      setWordCount(wc);
    } else if (file.name.endsWith('.pdf')) {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const tc = await page.getTextContent();
          text += tc.items.map((item: any) => item.str).join(' ') + '\n\n';
        }
        setContent(text);
        const wc = text.split(/\s+/).filter(Boolean).length;
        setWordCount(wc);
      } catch (err) {
        setContent('Error reading PDF. Try a text file instead.');
      }
    }
  }, []);

  const estimateTime = () => {
    if (!subject.trim() || wordCount === 0) return;
    const speed = readingSpeeds.find((r) => r.subject.toLowerCase() === subject.toLowerCase());
    const wpm = speed?.wpm || 200;
    setEstimatedTime(Math.ceil(wordCount / wpm));
  };

  const startReading = () => {
    setReadingStarted(true);
    setStartTime(Date.now());
    setMeasuredWpm(null);
  };

  const finishReading = () => {
    const elapsed = (Date.now() - startTime) / 60000; // minutes
    const wpm = Math.round(wordCount / elapsed);
    setMeasuredWpm(wpm);
    setReadingStarted(false);
    if (subject.trim()) {
      setReadingSpeed(subject.trim(), wpm);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Document Reader</h1>
        <p className="text-sm text-muted-foreground">Upload, read, and track your reading speed</p>
      </div>

      {/* Upload */}
      <div className="glass-card p-6">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary/50 transition-colors">
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <span className="text-sm font-medium text-foreground">Upload PDF or TXT</span>
          <span className="text-xs text-muted-foreground mt-1">{fileName || 'Click to browse'}</span>
          <input type="file" accept=".pdf,.txt" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {content && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-card p-3 text-center">
              <FileText className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{wordCount.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Words</p>
            </div>
            <div className="glass-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="h-8 text-xs"
                />
              </div>
              <Button onClick={estimateTime} size="sm" className="w-full bg-primary text-primary-foreground text-xs">
                <Clock className="h-3 w-3 mr-1" /> Estimate
              </Button>
            </div>
            {estimatedTime !== null && (
              <div className="glass-card p-3 text-center">
                <Clock className="h-4 w-4 text-accent mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{estimatedTime}m</p>
                <p className="text-xs text-muted-foreground">Est. time</p>
              </div>
            )}
            {measuredWpm !== null && (
              <div className="glass-card p-3 text-center">
                <Zap className="h-4 w-4 text-warning mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">{measuredWpm}</p>
                <p className="text-xs text-muted-foreground">WPM</p>
              </div>
            )}
          </div>

          {estimatedTime !== null && (
            <div className="glass-card p-4 bg-primary/5 border-primary/20">
              <p className="text-sm text-foreground">
                📖 You need approximately <strong>{estimatedTime} minutes</strong> to finish this document.
              </p>
            </div>
          )}

          {/* Reading controls */}
          <div className="flex gap-2">
            {!readingStarted ? (
              <Button onClick={startReading} className="bg-success text-success-foreground hover:bg-success/90">
                Start Reading
              </Button>
            ) : (
              <Button onClick={finishReading} className="bg-accent text-accent-foreground hover:bg-accent/90">
                Finish Reading
              </Button>
            )}
          </div>

          {/* Document content */}
          <div className="glass-card p-6 max-h-[500px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">{content}</pre>
          </div>

          {/* Reading speeds */}
          {readingSpeeds.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Your Reading Speeds</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {readingSpeeds.map((r) => (
                  <div key={r.subject} className="bg-secondary rounded-lg p-2 text-center">
                    <p className="text-xs font-medium text-foreground">{r.subject}</p>
                    <p className="text-sm font-bold text-primary">{r.wpm} WPM</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
