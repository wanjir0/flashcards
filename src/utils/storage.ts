import type { Store } from '../types';

const KEY = 'flashcard-coach:v1';
const empty: Store = { progress: {}, streakDays: 0, lastDay: '' };
const day = (t = Date.now()) => new Date(t).toISOString().slice(0, 10);

export function load(): Store {
  try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }; } catch { return empty; }
}
export function save(s: Store) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode: ignore */ }
}
export const reset = (): Store => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } return empty; };

/** Counts consecutive study days. */
export function touchStreak(s: Store): Store {
  if (s.lastDay === day()) return s;
  return { ...s, lastDay: day(), streakDays: s.lastDay === day(Date.now() - 864e5) ? s.streakDays + 1 : 1 };
}
