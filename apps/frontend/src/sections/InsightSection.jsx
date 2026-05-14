import { resultBars } from "../constants/index.js";
import { ShellCard, ShellInner } from "../components/ui/Card.jsx";

export function InsightSection() {
  return (
    <section className="insight-section">
      <ShellCard className="results-card">
        <ShellInner>
          <div className="results-copy">
            <div className="eyebrow">Results snapshot</div>
            <h2>Results Stay Clear</h2>
            <p>
              See vote share and winning options in a format simple enough to publish.
            </p>
          </div>

          <div className="results-bars">
            {resultBars.map((bar) => (
              <div className="result-row" key={bar.label}>
                <div className="result-row-meta">
                  <span>{bar.label}</span>
                  <strong>{bar.value}%</strong>
                </div>
                <div className="result-track">
                  <div
                    className="result-fill"
                    style={{ width: `${bar.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ShellInner>
      </ShellCard>
    </section>
  );
}
