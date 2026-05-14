import { resultBars } from "../constants/index.js";

export function InsightSection() {
  return (
    <section className="insight-section" style={{ maxWidth: '1120px', margin: '120px auto', padding: '0 24px' }}>
      <div className="sketch-box" style={{ padding: '64px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
        <div className="results-copy">
          <div className="eyebrow sketch-text" style={{ padding: '4px 12px', background: 'var(--warm)', border: '2px solid var(--text)', borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px', display: 'inline-block', marginBottom: '16px' }}>
            Results snapshot
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 16px 0' }}>Results Stay Clear.</h2>
          <p style={{ color: 'var(--muted)', fontSize: '1.2rem', lineHeight: 1.6 }}>
            See vote share and winning options in a format simple enough to publish anywhere.
          </p>
        </div>

        <div className="results-bars" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {resultBars.map((bar) => (
            <div className="result-row" key={bar.label}>
              <div className="result-row-meta" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 600 }}>
                <span>{bar.label}</span>
                <strong style={{ color: 'var(--accent)' }}>{bar.value}%</strong>
              </div>
              <div className="result-track" style={{ height: '24px', background: 'var(--line)', borderRadius: '99px', overflow: 'hidden', border: '2px solid var(--line-strong)' }}>
                <div
                  className="result-fill"
                  style={{ width: `${bar.value}%`, height: '100%', background: 'var(--accent)', borderRadius: '99px' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
