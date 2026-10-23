import { useState } from 'react';
import type { Domain, Mode, Store } from '../../types';
import { CARDS, DOMAINS } from '../../data/cards';
import { isWeak, readiness } from '../../utils/scheduler';
import { ReadinessRing } from '../../components/ReadinessRing';

interface Props { store: Store; onStart: (mode: Mode, domain: Domain | 'All') => void; onReset: () => void }

export function Dashboard({ store, onStart, onReset }: Props) {
  const [domain, setDomain] = useState<Domain | 'All'>('All');
  const weakCount = CARDS.filter(c => store.progress[c.id] && isWeak(store.progress[c.id])).length;
  const dueCount = CARDS.filter(c => { const p = store.progress[c.id]; return p && p.seen > 0 && p.due <= Date.now(); }).length;

  return (
    <div className="panel">
      <header>
        <div><h1>Flashcard Coach</h1><p>Azure Fundamentals · AZ-900</p></div>
        <div className="streak" title="Consecutive study days">🔥 {store.streakDays}</div>
      </header>
      <ReadinessRing value={readiness(CARDS, store.progress)} />
      <div className="modes">
        <button className="primary" onClick={() => onStart('smart', domain)}>⚡ Smart review<small>{dueCount} due + new</small></button>
        <button className="danger" disabled={!weakCount} onClick={() => onStart('weak', domain)}>🎯 Weak spots<small>{weakCount} cards</small></button>
        <button onClick={() => onStart('cram', domain)}>🧠 Cram<small>random mix</small></button>
      </div>
      <select value={domain} onChange={e => setDomain(e.target.value as Domain | 'All')}>
        <option value="All">All domains</option>{DOMAINS.map(d => <option key={d}>{d}</option>)}
      </select>
      <div className="domains">{DOMAINS.map(d => {
        const v = readiness(CARDS.filter(c => c.domain === d), store.progress);
        return <div key={d} className="drow"><span>{d}</span><div className="meter"><div style={{ width: `${v}%` }} /></div><b>{v}%</b></div>;
      })}</div>
      <button className="ghost" onClick={() => confirm('Erase all progress?') && onReset()}>Reset progress</button>
    </div>
  );
}
