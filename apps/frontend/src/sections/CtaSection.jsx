import { ShellCard, ShellInner } from "../components/ui/Card.jsx";
import { Icon } from "../components/ui/Icon.jsx";

export function CtaSection() {
  return (
    <section className="cta-section">
      <ShellCard className="cta-card">
        <ShellInner className="cta-inner">
          <div>
            <div className="eyebrow eyebrow-dark">
              Ready to launch your first poll?
            </div>
            <h2>Launch Your Poll</h2>
          </div>

          <div className="cta-actions">
            <button className="button button-dark" type="button">
              Create with Ratio'd
              <span className="button-icon button-icon-dark">
                <Icon name="arrow" />
              </span>
            </button>
            <button className="button button-outline-dark" type="button">
              View Product Tour
            </button>
          </div>
        </ShellInner>
      </ShellCard>
    </section>
  );
}
