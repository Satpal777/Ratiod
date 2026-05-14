import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
const AUTH_BASE_URL = `${API_BASE_URL}/api/auth`;

const navLinks = ["Product", "How it works", "Live demo", "Community"];

const stats = [
  { value: "12K+", label: "polls launched every week" },
  { value: "2.4M", label: "votes counted in real time" },
  { value: "180+", label: "communities using Ratio'd daily" },
];

const showcasePolls = [
  {
    category: "Tech launch",
    title: "Which feature should go live first?",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    votes: "18.2K votes",
  },
  {
    category: "Food debate",
    title: "What wins the community vote tonight?",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
    votes: "9.4K votes",
  },
  {
    category: "Creator poll",
    title: "Pick the next livestream challenge.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    votes: "24.6K votes",
  },
];

const featureCards = [
  {
    eyebrow: "Instant setup",
    title: "Create polls instantly.",
    text: "Write a question, add options, and share before the moment passes.",
    icon: "bolt",
  },
  {
    eyebrow: "Flexible identity",
    title: "Anonymous or authenticated.",
    text: "Run casual public takes or trusted rooms with signed-in voting.",
    icon: "mask",
  },
  {
    eyebrow: "Smart sharing",
    title: "Links that expire cleanly.",
    text: "Time-box a decision and close voting automatically when the link ends.",
    icon: "clock",
  },
  {
    eyebrow: "Live signal",
    title: "Analytics without the clutter.",
    text: "Track vote share, participation, and public result engagement.",
    icon: "chart",
  },
];

const steps = [
  {
    number: "01",
    title: "Write the question",
    text: "Start with a clear prompt and answer options people can scan fast.",
  },
  {
    number: "02",
    title: "Share the link",
    text: "Drop it in chat, social, email, or anywhere your audience already is.",
  },
  {
    number: "03",
    title: "Read the room",
    text: "Watch the vote move live and publish a clean result page.",
  },
];

const resultBars = [
  { label: "Live reaction voting", value: 64 },
  { label: "Anonymous voting", value: 23 },
  { label: "Invite-only polls", value: 13 },
];

async function authRequest(path, options = {}) {
  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(
      payload?.message ?? payload?.error ?? "Authentication request failed.",
    );
  }

  return payload;
}

function Icon({ name }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "1.7",
  };

  const paths = {
    arrow: (
      <>
        <path {...stroke} d="M7 17 17 7" />
        <path {...stroke} d="M9 7h8v8" />
      </>
    ),
    play: <path {...stroke} d="M9 7v10l8-5-8-5Z" />,
    bolt: <path {...stroke} d="m13 2-8 11h6l-1 9 8-12h-6l1-8Z" />,
    mask: (
      <>
        <path {...stroke} d="M4 9c2-2 4.7-3 8-3s6 1 8 3v3.5c0 3.2-3.2 5.5-8 5.5s-8-2.3-8-5.5V9Z" />
        <path {...stroke} d="M8 12h3M13 12h3M9.5 15c1.7.8 3.3.8 5 0" />
      </>
    ),
    clock: (
      <>
        <path {...stroke} d="M12 22a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
        <path {...stroke} d="M12 8v4l3 2" />
      </>
    ),
    chart: (
      <>
        <path {...stroke} d="M4 19V5M4 19h16" />
        <path {...stroke} d="M8 15v-4M12 15V8M16 15v-6" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      {paths[name]}
    </svg>
  );
}

function Spark({ className = "" }) {
  return (
    <svg className={`spark ${className}`} viewBox="0 0 42 42" aria-hidden="true">
      <path d="M21 2 25 17 40 21 25 25 21 40 17 25 2 21 17 17 21 2Z" />
    </svg>
  );
}

function DoodleArrow({ className = "" }) {
  return (
    <svg className={`doodle-arrow ${className}`} viewBox="0 0 120 72" aria-hidden="true">
      <path d="M8 53C28 18 70 13 105 31" />
      <path d="m94 18 15 16-22 4" />
    </svg>
  );
}

function MiniBars({ className = "" }) {
  return (
    <svg className={`mini-bars ${className}`} viewBox="0 0 130 70" aria-hidden="true">
      <rect x="8" y="42" width="16" height="20" rx="5" />
      <rect x="34" y="28" width="16" height="34" rx="5" />
      <rect x="60" y="14" width="16" height="48" rx="5" />
      <rect x="86" y="22" width="16" height="40" rx="5" />
      <path d="M9 18c18 8 31 8 45-2s28-8 58 4" />
    </svg>
  );
}

function PollPreview() {
  const [selected, setSelected] = useState("feature-a");

  const options = [
    { id: "feature-a", label: "Live reactions beside results", votes: 48 },
    { id: "feature-b", label: "Anonymous voting for hot takes", votes: 31 },
    { id: "feature-c", label: "Public results after closing", votes: 21 },
  ];

  return (
    <div className="shell-card shell-card-poll">
      <div className="shell-inner poll-panel">
        <div className="poll-panel-header">
          <div>
            <p className="panel-kicker">Live poll preview</p>
            <h3>What should Ratio'd ship next?</h3>
          </div>
          <span className="live-pill">
            <span className="live-dot" />
            842 voting
          </span>
        </div>

        <div className="poll-visual">
          <img
            alt="Audience reacting to a live poll"
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
          />
          <MiniBars />
          <span className="visual-badge">+42% engagement</span>
        </div>

        <div className="poll-option-list">
          {options.map((option) => (
            <button
              key={option.id}
              className={`poll-option ${selected === option.id ? "poll-option-selected" : ""}`}
              onClick={() => setSelected(option.id)}
              type="button"
            >
              <span className="poll-option-copy">
                <strong>{option.label}</strong>
                <span>{option.votes}% of early votes</span>
              </span>
              <span className="poll-check" />
            </button>
          ))}
        </div>

        <div className="poll-panel-footer">
          <div>
            <p className="footer-label">Share state</p>
            <p className="footer-value">Public link ready</p>
          </div>
          <button className="button button-primary" type="button">
            Launch Poll
            <span className="button-icon">
              <Icon name="arrow" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function FeatureIcon({ name }) {
  return (
    <span className="feature-icon">
      <Icon name={name} />
    </span>
  );
}

function App() {
  const [authLoading, setAuthLoading] = useState(false);
  const [isNavbarScrolled, setIsNavbarScrolled] = useState(() => window.scrollY > 18);
  const [session, setSession] = useState(null);

  async function refreshSession() {
    try {
      const data = await authRequest("/get-session");
      setSession(data?.user ? data : null);
    } catch {
      setSession(null);
    }
  }

  useEffect(() => {
    let isMounted = true;

    authRequest("/get-session")
      .then((data) => {
        if (isMounted) setSession(data?.user ? data : null);
      })
      .catch(() => {
        if (isMounted) setSession(null);
      });

    function handleScroll() {
      setIsNavbarScrolled(window.scrollY > 18);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      isMounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  async function handleGoogleSignIn() {
    setAuthLoading(true);

    try {
      const data = await authRequest("/sign-in/social", {
        body: JSON.stringify({
          provider: "google",
          callbackURL: window.location.origin,
          errorCallbackURL: window.location.origin,
          newUserCallbackURL: window.location.origin,
        }),
        method: "POST",
      });

      if (data?.url) {
        window.location.assign(data.url);
        return;
      }

      await refreshSession();
    } catch (error) {
      window.alert(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    setAuthLoading(true);

    try {
      await authRequest("/sign-out", { method: "POST" });
      setSession(null);
    } catch (error) {
      window.alert(error.message);
    } finally {
      setAuthLoading(false);
    }
  }

  return (
    <div className="page-shell">
      <div className="page-noise" />
      <div className="background-grid" />

      <header className={`topbar-wrap ${isNavbarScrolled ? "topbar-scrolled" : ""}`}>
        <div className="topbar">
          <a className="brand-mark" href="/">
            <span className="brand-dot" />
            Ratio'd
          </a>

          <nav className="nav-links" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                href="/"
                key={link}
                onClick={(event) => event.preventDefault()}
              >
                {link}
              </a>
            ))}
          </nav>

          {session?.user ? (
            <button
              className="button button-secondary topbar-cta"
              disabled={authLoading}
              onClick={handleSignOut}
              type="button"
            >
              Sign Out
            </button>
          ) : (
            <button
              className="button button-secondary topbar-cta"
              disabled={authLoading}
              onClick={handleGoogleSignIn}
              type="button"
            >
              Sign in with Google
              <span className="button-icon">
                <Icon name="arrow" />
              </span>
            </button>
          )}
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">Real-time polling platform</div>
            <h1>Vote in Seconds</h1>
            <p className="hero-text">
              Launch quick polls, collect live votes, and share clean results instantly.
            </p>

            <div className="hero-actions">
              <button className="button button-primary" type="button">
                Create Poll
                <span className="button-icon">
                  <Icon name="arrow" />
                </span>
              </button>

              <button className="button button-secondary" type="button">
                <span className="button-icon">
                  <Icon name="play" />
                </span>
                View Demo
              </button>
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

        <section className="stats-section">
          {stats.map((stat) => (
            <div className="shell-card stat-card" key={stat.label}>
              <div className="shell-inner">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="showcase-section">
          <div className="showcase-heading">
            <div className="eyebrow">Shareable moments</div>
            <h2>Made to Share</h2>
          </div>

          <div className="showcase-grid">
            {showcasePolls.map((poll) => (
              <div className="shell-card showcase-card" key={poll.title}>
                <div className="shell-inner">
                  <div className="showcase-image">
                    <img alt={poll.title} src={poll.image} />
                    <span className="vote-chip">{poll.votes}</span>
                  </div>
                  <div className="showcase-copy">
                    <span>{poll.category}</span>
                    <h3>{poll.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

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
              <div className="shell-card feature-card" key={card.title}>
                <div className="shell-inner">
                  <FeatureIcon name={card.icon} />
                  <p className="card-kicker">{card.eyebrow}</p>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="workflow-section">
          <div className="workflow-copy">
            <div className="eyebrow">Simple flow</div>
            <h2>Three Quick Moves</h2>
          </div>

          <div className="workflow-grid">
            {steps.map((step) => (
              <div className="shell-card workflow-card" key={step.number}>
                <div className="shell-inner">
                  <span className="step-number">{step.number}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="insight-section">
          <div className="shell-card results-card">
            <div className="shell-inner">
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
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="shell-card cta-card">
            <div className="shell-inner cta-inner">
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
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
