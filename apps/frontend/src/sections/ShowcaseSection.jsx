import { showcasePolls } from "../constants/index.js";
import { ShellCard, ShellInner } from "../components/ui/Card.jsx";

export function ShowcaseSection() {
  return (
    <section className="showcase-section">
      <div className="showcase-heading">
        <div className="eyebrow">Shareable moments</div>
        <h2>Made to Share</h2>
      </div>

      <div className="showcase-grid">
        {showcasePolls.map((poll) => (
          <ShellCard className="showcase-card" key={poll.title}>
            <ShellInner>
              <div className="showcase-image">
                <img alt={poll.title} src={poll.image} />
                <span className="vote-chip">{poll.votes}</span>
              </div>
              <div className="showcase-copy">
                <span>{poll.category}</span>
                <h3>{poll.title}</h3>
              </div>
            </ShellInner>
          </ShellCard>
        ))}
      </div>
    </section>
  );
}
