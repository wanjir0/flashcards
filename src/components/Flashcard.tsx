import type { Card } from '../types';

interface Props { card: Card; buddy?: Card; flipped: boolean; onFlip: () => void }

export function Flashcard({ card, buddy, flipped, onFlip }: Props) {
  return (
    <div className={`card ${flipped ? 'flipped' : ''}`} onClick={onFlip} role="button" aria-label="Flip card">
      <div className="face front">
        <span className="tag">{card.domain}</span>
        <h2>{card.q}</h2>
        <small>tap or press Space to reveal</small>
      </div>
      <div className="face back">
        <p>{card.a}</p>
        {buddy && <p className="warn">⚠ Don’t mix up with: <b>{buddy.q}</b></p>}
      </div>
    </div>
  );
}
