import { useState } from "react";
import { Icon, MiniBars } from "./ui/Icon.jsx";

export function PollPreview() {
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
