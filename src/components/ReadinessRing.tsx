export function ReadinessRing({ value }: { value: number }) {
  const r = 52, c = 2 * Math.PI * r;
  const label = value >= 80 ? 'Exam ready 🚀' : value >= 40 ? 'Getting there' : 'Just starting';
  return (
    <div className="ring">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} className="track" />
        <circle cx="60" cy="60" r={r} className="bar" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <div className="ring-text"><b>{value}%</b><span>{label}</span></div>
    </div>
  );
}
