import { steps } from "../constants/index.js";
import { ShellCard, ShellInner } from "../components/ui/Card.jsx";

export function WorkflowSection() {
  return (
    <section className="workflow-section">
      <div className="workflow-copy">
        <div className="eyebrow">Simple flow</div>
        <h2>Three Quick Moves</h2>
      </div>

      <div className="workflow-grid">
        {steps.map((step) => (
          <ShellCard className="workflow-card" key={step.number}>
            <ShellInner>
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </ShellInner>
          </ShellCard>
        ))}
      </div>
    </section>
  );
}
