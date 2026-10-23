import { useEffect, useState } from 'react';
import type { Card, Domain, Grade, Mode } from './types';
import { CARDS } from './data/cards';
import { blank, buildQueue, review } from './utils/scheduler';
import { load, reset, save, touchStreak } from './utils/storage';
import { Dashboard } from './features/dashboard/Dashboard';
import { StudyView } from './features/study/StudyView';
import './styles.css';

export default function App() {
  const [store, setStore] = useState(load);
  const [queue, setQueue] = useState<Card[] | null>(null);
  useEffect(() => save(store), [store]);

  const onGrade = (id: string, g: Grade) => setStore(s => {
    const t = touchStreak(s);
    return { ...t, progress: { ...t.progress, [id]: review(t.progress[id] ?? blank(), g) } };
  });
  const start = (mode: Mode, domain: Domain | 'All') =>
    setQueue(buildQueue(domain === 'All' ? CARDS : CARDS.filter(c => c.domain === domain), store.progress, mode));

  return <main>{queue
    ? <StudyView queue={queue} all={CARDS} onGrade={onGrade} onExit={() => setQueue(null)} />
    : <Dashboard store={store} onStart={start} onReset={() => setStore(reset())} />}</main>;
}
