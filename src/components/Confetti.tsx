import { useMemo } from 'react';

const COLORS = ['#0078d4', '#50e6ff', '#ffb900', '#6ee7a8', '#ff6b9d'];
/** Pure CSS confetti - no dependencies. */
export function Confetti({ count = 60 }: { count?: number }) {
  const bits = useMemo(() => Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 0.6, dur: 1.8 + Math.random() * 1.5, color: COLORS[i % COLORS.length],
  })), [count]);
  return <div className="confetti" aria-hidden>{bits.map((b, i) =>
    <i key={i} style={{ left: `${b.left}%`, background: b.color, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s` }} />)}</div>;
}
