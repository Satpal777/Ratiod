import { Icon } from "../components/ui/Icon.jsx";

import { useNavigate } from "react-router-dom";

export function CtaSection() {
  const navigate = useNavigate();
  return (
    <section className="cta-section" style={{ maxWidth: '1120px', margin: '120px auto', padding: '0 24px' }}>
      <div className="sketch-box" style={{ textAlign: 'center', padding: '64px 32px', background: 'var(--warm)' }}>
        <span className="sketch-text" style={{ fontSize: '1.5rem', marginBottom: '16px', display: 'inline-block' }}>
          What are you waiting for? 🚀
        </span>
        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '0 0 40px 0' }}>Launch Your Poll.</h2>

        <div className="cta-actions" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button className="button button-primary" type="button" onClick={() => navigate("/dashboard")} style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            Start Building
            <span className="button-icon">
              <Icon name="arrow" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
