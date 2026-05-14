import { steps } from "../constants/index.js";

export function WorkflowSection() {
  return (
    <section className="workflow-section" style={{ maxWidth: '1120px', margin: '120px auto', padding: '0 24px' }}>
      <div className="workflow-copy" style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div className="eyebrow sketch-text" style={{ padding: '4px 12px', background: 'var(--warm)', border: '2px solid var(--text)', borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px', display: 'inline-block', marginBottom: '16px' }}>
          Smooth operations
        </div>
        <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text)' }}>How It Flows.</h2>
      </div>

      <div className="workflow-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
        {steps.map((step, i) => (
          <div className="workflow-step-item sketch-box" key={step.number} style={{ display: 'flex', flexDirection: 'column', gap: '16px', transform: `rotate(${i % 2 === 0 ? '-1deg' : '1deg'})` }}>
            <div style={{ background: 'var(--accent)', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem', flexShrink: 0, fontFamily: 'var(--font-sketch)', border: '2px solid var(--text)' }}>
              {step.number}
            </div>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: 800 }}>{step.title}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.5, fontSize: '1.1rem' }}>{step.text}</p>
            </div>
          </div>
        ))}
      </div>


    </section>
  );
}
