import { useState } from 'react';
import type { Card, Grade } from '../../types';

/**
 * Runs one study session. The adaptive bit: when you miss a card it comes back
 * in a few cards, and the card you most likely confused it with is slotted in first.
 */
export function useStudySession(initial: Card[], all: Card[], onGrade: (id: string, g: Grade) => void) {
  const [queue, setQueue] = useState(initial);
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [missed, setMissed] = useState<string[]>([]);
  const [correct, setCorrect] = useState(0);
  const card = queue[i];
  const buddy = card?.confusedWith ? all.find(c => c.id === card.confusedWith) : undefined;

  const grade = (g: Grade) => {
    if (!card) return;
    onGrade(card.id, g);
    if (g === 0) {
      setMissed(m => (m.includes(card.id) ? m : [...m, card.id]));
      const rest = queue.slice(i + 1);
      setQueue([...queue.slice(0, i + 1), ...rest.slice(0, 2), ...(buddy ? [buddy] : []), card, ...rest.slice(2)]);
    } else setCorrect(n => n + 1);
    setI(n => n + 1);
    setFlipped(false);
  };

  return { card, buddy, index: i, total: queue.length, flipped, flip: () => setFlipped(f => !f), grade, done: i >= queue.length, missed, correct };
}
