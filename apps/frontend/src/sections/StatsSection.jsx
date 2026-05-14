import { stats } from "../constants/index.js";

export function StatsSection() {
  return (
    <section className="stats-section" style={{ maxWidth: '1120px', margin: '0 auto', padding: '64px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '48px', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 200px', maxWidth: '300px' }}>
        <span className="sketch-text" style={{ fontSize: '1.8rem', color: 'var(--muted)', lineHeight: 1.4 }}>
          Trusted by 10,000+ creators and startup teams
        </span>
      </div>
      <div style={{ display: 'flex', flex: '2 1 600px', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {stats.map((stat, i) => (
          <div className="sketch-box" key={stat.label} style={{ transform: `rotate(${i % 2 === 0 ? 2 : -2}deg)`, flex: '1 1 200px', textAlign: 'center', padding: '16px' }}>
            <strong style={{ display: 'block', fontSize: '3rem', fontWeight: 800, color: 'var(--accent)', marginBottom: '8px' }}>{stat.value}</strong>
            <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
