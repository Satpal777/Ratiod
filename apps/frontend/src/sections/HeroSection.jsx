import { useNavigate } from "react-router-dom";
import { Icon, Spark, DoodleArrow } from "../components/ui/Icon.jsx";
import { PollPreview } from "../components/PollPreview.jsx";
import { Button } from "../components/ui/Button.jsx";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <div className="eyebrow">Real-time polling platform</div>
        <h1>Vote in Seconds</h1>
        <p className="hero-text">
          Launch quick polls, collect live votes, and share clean results instantly.
        </p>

        <div className="hero-actions">
          <Button variant="primary" onClick={() => navigate("/dashboard")}>
            Create Poll
            <span className="button-icon">
              <Icon name="arrow" />
            </span>
          </Button>

          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            <span className="button-icon">
              <Icon name="play" />
            </span>
            View Demo
          </Button>
        </div>

        <div className="hero-proof">
          <span>Trusted by launch teams, creators, and active communities.</span>
        </div>
      </div>

      <div className="hero-visual">
        <PollPreview />
      </div>

      <Spark className="hero-spark hero-spark-one" />
      <Spark className="hero-spark hero-spark-two" />
      <DoodleArrow className="hero-arrow" />
    </section>
  );
}
