import { useEffect, useState } from 'react';
import type { Card, Grade } from '../../types';
import { Flashcard } from '../../components/Flashcard';
import { Confetti } from '../../components/Confetti';
import { useStudySession } from './useStudySession';

interface Props { queue: Card[]; all: Card[]; onGrade: (id: string, g: Grade) => void; onExit: () => void }
const GRADES: { g: Grade; label: string; cls: string }[] = [
  { g: 0, label: 'Again', cls: 'again' }, { g: 1, label: 'Hard', cls: 'hard' },
  { g: 2, label: 'Good', cls: 'good' }, { g: 3, label: 'Easy', cls: 'easy' },
];

export function StudyView({ queue, all, onGrade, onExit }: Props) {
  const s = useStudySession(queue, all, onGrade);
  const [feedback, setFeedback] = useState<{ mood: 'happy' | 'sad'; id: number } | null>(null);

  const grade = (value: Grade) => {
    setFeedback(current => ({ mood: value === 0 ? 'sad' : 'happy', id: (current?.id ?? 0) + 1 }));
    s.grade(value);
  };

  useEffect(() => {
    if (!feedback) return;
    const timeout = window.setTimeout(() => setFeedback(null), 1500);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); s.flip(); }
      else if (s.flipped && ['1', '2', '3', '4'].includes(e.key)) grade((Number(e.key) - 1) as Grade);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (s.done) {
    const empty = queue.length === 0;
    return (
      <div className="panel center">
        {!empty && s.missed.length === 0 && <Confetti />}
        <h1>{empty ? 'Nothing to review 🎉' : s.missed.length === 0 ? 'Flawless! 🏆' : 'Session complete ✅'}</h1>
        <p>{empty ? 'Try Cram mode or come back when cards are due.' :
          `${s.correct} recalled · ${s.missed.length} need more love. They’ll return sooner, with their look-alikes.`}</p>
        <button className="primary" onClick={onExit}>Back to dashboard</button>
      </div>
    );
  }
  return (
    <div className="panel">
      {feedback && (
        <div key={feedback.id} className={`kitten-feedback ${feedback.mood === 'sad' ? 'wrong' : ''}`} role="status" aria-live="polite">
          <span className="kitten-face" aria-hidden="true">{feedback.mood === 'happy' ? '😻' : '🥺🐱'}</span>
          <span className="kitten-message">{feedback.mood === 'happy' ? 'Purr-fect! You got it!' : 'Aww, keep practicing!'}</span>
        </div>
      )}
      <div className="topbar"><button className="ghost" onClick={onExit}>← Exit</button><span>{s.index + 1} / {s.total}</span></div>
      <div className="progress"><div style={{ width: `${(s.index / s.total) * 100}%` }} /></div>
      <Flashcard card={s.card} buddy={s.buddy} flipped={s.flipped} onFlip={s.flip} />
      <div className={`grades ${s.flipped ? 'show' : ''}`}>
        {GRADES.map(({ g, label, cls }) => <button key={g} className={cls} onClick={() => grade(g)}>{label}<kbd>{g + 1}</kbd></button>)}
      </div>
    </div>
  );
}
