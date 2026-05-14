import { featureCards } from "../constants/index.js";
import { ShellCard, ShellInner } from "../components/ui/Card.jsx";
import { FeatureIcon } from "../components/ui/Icon.jsx";

export function StorySection() {
  return (
    <section className="story-section">
      <div className="story-intro">
        <div className="eyebrow">Why Ratio'd works</div>
        <h2>Built for Momentum</h2>
        <p>
          Frictionless voting, clean results, and just enough energy to keep people engaged.
        </p>
      </div>

      <div className="feature-grid">
        {featureCards.map((card) => (
          <ShellCard className="feature-card" key={card.title}>
            <ShellInner>
              <FeatureIcon name={card.icon} />
              <p className="card-kicker">{card.eyebrow}</p>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </ShellInner>
          </ShellCard>
        ))}
      </div>
    </section>
  );
}
