import { describe, expect, it } from 'vitest';
import { CARDS } from '../src/data/cards';
import { blank, buildQueue, INTERVALS, isWeak, readiness, review } from '../src/utils/scheduler';

describe('review', () => {
  it('promotes on Good and doubles up on Easy', () => {
    expect(review(blank(), 2).box).toBe(1);
    expect(review(blank(), 3).box).toBe(2);
  });
  it('drops to box 0 on Again and counts a lapse', () => {
    const p = review({ ...blank(), box: 4, streak: 3 }, 0, 1000);
    expect(p).toMatchObject({ box: 0, lapses: 1, streak: 0, due: 1000 + INTERVALS[0] });
  });
});

describe('buildQueue', () => {
  it('weak mode only returns cards you keep missing', () => {
    const progress = { iaas: { ...blank(), seen: 3, lapses: 2, box: 0 }, capex: { ...blank(), seen: 3, box: 4 } };
    expect(buildQueue(CARDS, progress, 'weak').map(c => c.id)).toEqual(['iaas']);
    expect(isWeak(progress.capex)).toBe(false);
  });
  it('smart mode caps new cards and puts due cards first', () => {
    const progress = { rg: { ...blank(), seen: 1, due: 0 } };
    const q = buildQueue(CARDS, progress, 'smart');
    expect(q[0].id).toBe('rg');
    expect(q.length).toBe(6);
  });
});

it('readiness rises with mastery', () => {
  expect(readiness(CARDS, {})).toBe(0);
  expect(readiness(CARDS, Object.fromEntries(CARDS.map(c => [c.id, { ...blank(), box: 5 }])))).toBe(100);
});

it('every confusedWith points at a real card', () => {
  const ids = new Set(CARDS.map(c => c.id));
  CARDS.filter(c => c.confusedWith).forEach(c => expect(ids.has(c.confusedWith!)).toBe(true));
});
