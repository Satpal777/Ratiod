import { stats } from "../constants/index.js";
import { ShellCard, ShellInner } from "../components/ui/Card.jsx";

export function StatsSection() {
  return (
    <section className="stats-section">
      {stats.map((stat) => (
        <ShellCard className="stat-card" key={stat.label}>
          <ShellInner>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </ShellInner>
        </ShellCard>
      ))}
    </section>
  );
}
