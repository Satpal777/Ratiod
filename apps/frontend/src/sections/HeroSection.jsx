import { useNavigate } from "react-router-dom";
import { Icon, Spark } from "../components/ui/Icon.jsx";
import { PollPreview } from "../components/PollPreview.jsx";
import { Button } from "../components/ui/Button.jsx";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-copy">
        <div
          className="eyebrow sketch-text"
          style={{
            padding: "4px 12px",
            background: "var(--warm)",
            border: "2px solid var(--text)",
            borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px",
            display: "inline-block",
            marginBottom: "16px",
          }}
        >
          Real-time polling platform
        </div>
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "var(--text)",
          }}
        >
          Vote in Seconds <br />
        </h1>
        <p
          className="hero-text"
          style={{
            color: "var(--muted)",
            fontSize: "1.2rem",
            maxWidth: "480px",
            marginTop: "24px",
          }}
        >
          Launch quick polls, collect live votes, and uncover AI-driven insights
          with our modern creator toolkit.
        </p>

        <div className="hero-actions" style={{ marginTop: "32px" }}>
          <Button variant="primary" onClick={() => navigate("/dashboard")}>
            Start Building
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

        <div style={{ marginTop: "24px" }}>
          <span
            className="sketch-text"
            style={{ fontSize: "1.2rem", color: "var(--muted)" }}
          >
            Free to use! 🚀
          </span>
        </div>
      </div>

      <div className="hero-visual" style={{ position: "relative", zIndex: 10 }}>
        <div
          className="sketch-box"
          style={{
            padding: "8px",
            background: "#fff",
            transform: "rotate(1deg)",
            width: "100%",
            maxWidth: "500px",
            margin: "0 auto"
          }}
        >
          <PollPreview />
        </div>
        <span
          className="sketch-text"
          style={{
            position: "absolute",
            top: "-30px",
            right: "40px",
            fontSize: "1.5rem",
            color: "var(--teal)",
            zIndex: 11
          }}
        >
          Live data! ⚡️
        </span>
      </div>

      <Spark
        className="hero-spark hero-spark-one"
        style={{ stroke: "var(--accent)" }}
      />
      <Spark
        className="hero-spark hero-spark-two"
        style={{ stroke: "var(--teal)" }}
      />
    </section>
  );
}
