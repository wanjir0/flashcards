import type { Card, Grade, Mode, Progress, ProgressMap } from '../types';

const MIN = 6e4, DAY = 864e5;
/** Leitner boxes 0-5: how long until a card is due again. */
export const INTERVALS = [10 * MIN, DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY];
export const MAX_BOX = INTERVALS.length - 1;

export const blank = (): Progress => ({ box: 0, due: 0, seen: 0, lapses: 0, streak: 0 });

/** Again drops to box 0; Hard holds; Good +1; Easy +2. */
export function review(p: Progress, grade: Grade, now = Date.now()): Progress {
  const box = grade === 0 ? 0 : Math.min(MAX_BOX, grade === 1 ? Math.max(1, p.box) : p.box + (grade === 3 ? 2 : 1));
  return {
    box, due: now + INTERVALS[box], seen: p.seen + 1,
    lapses: p.lapses + (grade === 0 ? 1 : 0), streak: grade === 0 ? 0 : p.streak + 1,
  };
}

/** Higher = needs more attention. */
export const weakness = (p: Progress) => p.lapses * 2 - p.streak - p.box;
export const isWeak = (p: Progress) => p.seen > 0 && p.lapses > 0 && p.box <= 2;

export function shuffle<T>(xs: T[], rnd = Math.random): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Smart = due cards (weakest first) + a few new ones. Weak = only trouble cards. Cram = everything. */
export function buildQueue(cards: Card[], progress: ProgressMap, mode: Mode, now = Date.now(), size = 20): Card[] {
  const p = (c: Card) => progress[c.id] ?? blank();
  const byWeakness = (a: Card, b: Card) => weakness(p(b)) - weakness(p(a));
  if (mode === 'cram') return shuffle(cards).slice(0, size);
  if (mode === 'weak') return cards.filter(c => isWeak(p(c))).sort(byWeakness).slice(0, size);
  const due = cards.filter(c => p(c).seen > 0 && p(c).due <= now).sort(byWeakness);
  const fresh = shuffle(cards.filter(c => p(c).seen === 0)).slice(0, 5);
  return [...due, ...fresh].slice(0, size);
}

/** 0-100 exam readiness: average box progress across the given cards. */
export function readiness(cards: Card[], progress: ProgressMap): number {
  if (!cards.length) return 0;
  const sum = cards.reduce((s, c) => s + (progress[c.id]?.box ?? 0) / MAX_BOX, 0);
  return Math.round((sum / cards.length) * 100);
}
