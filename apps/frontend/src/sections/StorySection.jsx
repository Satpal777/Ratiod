import { featureCards } from "../constants/index.js";
import { FeatureIcon } from "../components/ui/Icon.jsx";

export function StorySection() {
  return (
    <section className="story-section" style={{ maxWidth: '1120px', margin: '120px auto', padding: '0 24px' }}>
      <div className="story-intro" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '600px', margin: '0 auto 64px auto' }}>
        <div className="eyebrow sketch-text" style={{ padding: '4px 12px', background: 'var(--warm)', border: '2px solid var(--text)', borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px', display: 'inline-block', marginBottom: '16px' }}>
          Why Ratio'd works
        </div>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 16px 0', textAlign: 'center' }}>Built for Momentum.</h2>
        <p style={{ color: 'var(--muted)', fontSize: '1.2rem', lineHeight: 1.6, textAlign: 'center' }}>
          Frictionless voting, clean results, and just enough energy to keep people engaged.
        </p>
      </div>

      <div className="feature-grid bento-grid">
        {featureCards.map((card, i) => {
          // Bento layout logic: alternating spans
          const isWide = i === 0 || i === 3;
          
          return (
            <div className={`sketch-box ${isWide ? 'bento-wide' : 'bento-narrow'}`} key={card.title} style={{ 
              transform: `rotate(${i % 2 === 0 ? 1 : -1}deg)`, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              padding: '32px',
              justifyContent: 'center'
            }}>
              <div style={{ background: 'var(--warm)', width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--text)' }}>
                <FeatureIcon name={card.icon} />
              </div>
              <div style={{ marginTop: 'auto' }}>
                <p className="sketch-text" style={{ fontSize: '1.2rem', margin: '0 0 8px 0', color: 'var(--accent)' }}>{card.eyebrow}</p>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 12px 0' }}>{card.title}</h3>
                <p style={{ color: 'var(--muted)', margin: 0, lineHeight: 1.6, fontSize: '1.1rem' }}>{card.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
