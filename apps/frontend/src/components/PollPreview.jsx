import { useState } from "react";
import { Icon } from "./ui/Icon.jsx";

export function PollPreview() {
  const [selected, setSelected] = useState("feature-a");

  const options = [
    { id: "feature-a", label: "Live reactions beside results", votes: 48 },
    { id: "feature-b", label: "Anonymous voting for hot takes", votes: 31 },
    { id: "feature-c", label: "Public results after closing", votes: 21 },
  ];

  return (
    <div style={{ padding: '16px', background: 'var(--panel)', borderRadius: '16px', border: '2px solid var(--text)', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <p className="sketch-text" style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--accent)' }}>Live poll preview</p>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>What should Ratio'd ship next?</h3>
        </div>
        <span style={{ background: '#fef2f2', color: '#ef4444', border: '2px solid #ef4444', padding: '4px 12px', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }} />
          842 voting
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            type="button"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              border: `2px solid ${selected === option.id ? 'var(--accent)' : 'var(--line-strong)'}`,
              borderRadius: '12px',
              background: selected === option.id ? 'rgba(0, 85, 255, 0.05)' : 'var(--panel)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
              transform: selected === option.id ? 'translateX(4px)' : 'none'
            }}
          >
            <div>
              <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px', color: 'var(--text)' }}>{option.label}</strong>
              <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{option.votes}% of early votes</span>
            </div>
            <div style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '50%', 
              border: `2px solid ${selected === option.id ? 'var(--accent)' : 'var(--line-strong)'}`,
              background: selected === option.id ? 'var(--accent)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {selected === option.id && <Icon name="check" style={{ color: '#fff', width: '14px', height: '14px' }} />}
            </div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '2px dashed var(--line-strong)' }}>
        <div>
          <p style={{ margin: '0 0 4px 0', color: 'var(--muted)', fontSize: '0.9rem' }}>Share state</p>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--teal)' }}>Public link ready</p>
        </div>
        <button className="button button-primary" type="button">
          Launch Poll
          <span className="button-icon">
            <Icon name="arrow" />
          </span>
        </button>
      </div>
    </div>
  );
}
