import { showcasePolls } from "../constants/index.js";

export function ShowcaseSection() {
  return (
    <section id="community" className="showcase-section" style={{ maxWidth: '1120px', margin: '0 auto', padding: '120px 24px', scrollMarginTop: '120px' }}>
      <div className="showcase-heading" style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div className="eyebrow sketch-text" style={{ padding: '4px 12px', background: 'var(--warm)', border: '2px solid var(--text)', borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px', display: 'inline-block', marginBottom: '16px' }}>
          Shareable moments
        </div>
        <h2 style={{ fontSize: '3rem', fontWeight: 800 }}>Made to Share.</h2>
      </div>

      <div className="showcase-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        {showcasePolls.map((poll) => (
          <div key={poll.title} style={{ 
            background: 'var(--panel)', 
            border: '2px solid var(--text)', 
            borderRadius: 'var(--radius-xl)', 
            boxShadow: 'var(--shadow)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            cursor: 'pointer',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '4px 8px 0 rgba(0,0,0,0.8)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
          >
            <div className="showcase-image" style={{ position: 'relative', width: '100%', height: '200px' }}>
              <img alt={poll.title} src={poll.image} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <span className="sketch-text" style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--accent)', color: '#fff', padding: '4px 12px', borderRadius: '8px', fontSize: '1rem', border: '2px solid #000' }}>{poll.votes}</span>
            </div>
            <div className="showcase-copy" style={{ padding: '24px' }}>
              <span style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{poll.category}</span>
              <h3 style={{ margin: '8px 0 0 0', fontSize: '1.25rem', color: 'var(--text)' }}>{poll.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
