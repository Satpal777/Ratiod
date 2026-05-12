import { useState } from "react";
import "./InteractivePoll.css";

const options = [
  { id: "classic", label: "Air Jordan Classic", votes: 1245 },
  { id: "aj1", label: "Air Jordan 1", votes: 3420 },
  { id: "aj4", label: "Air Jordan 4", votes: 2800 },
];

const InteractivePoll = () => {
  const [selected, setSelected] = useState(null);
  const [voted, setVoted] = useState(false);

  const totalVotes = options.reduce((s, o) => s + o.votes, 0) + (voted ? 1 : 0);

  const handleVote = () => {
    if (selected) setVoted(true);
  };

  return (
    <div className="interactive-poll-card">
      <button className="poll-close-btn" aria-label="Close">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="poll-content-side">
        <h2 className="poll-title">
          Which Air Jordan is your all-time favourite?
        </h2>

        <div className="poll-options">
          {!voted ? (
            <>
              {options.map((opt) => (
                <label
                  key={opt.id}
                  className={`poll-option-radio ${selected === opt.id ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="sneaker"
                    value={opt.id}
                    checked={selected === opt.id}
                    onChange={() => setSelected(opt.id)}
                  />
                  <span className="radio-custom">
                    {selected === opt.id && <span className="radio-inner" />}
                  </span>
                  {opt.label}
                </label>
              ))}

              <button
                className="poll-submit-btn"
                onClick={handleVote}
                disabled={!selected}
              >
                Continue →
              </button>
            </>
          ) : (
            <div className="poll-results animate-fade-in-up">
              <h3 className="results-thanks">Thanks for voting! 🎉</h3>
              <p className="results-promo">
                Your code: <strong>JORDAN20</strong> — 20% off first order
              </p>

              <div className="results-bars">
                {options.map((opt) => {
                  const isSelected = selected === opt.id;
                  const finalVotes = opt.votes + (isSelected ? 1 : 0);
                  const pct = Math.round((finalVotes / totalVotes) * 100);

                  return (
                    <div
                      key={opt.id}
                      className={`result-item ${isSelected ? "user-voted" : ""}`}
                    >
                      <div className="result-header">
                        <span>
                          {opt.label}
                          {isSelected && <span className="badge-you">You</span>}
                        </span>
                        <span className="result-percentage">{pct}%</span>
                      </div>
                      <div className="result-bar-bg">
                        <div
                          className="result-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="total-votes-text">
                {totalVotes.toLocaleString()} total votes
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="poll-image-side">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
          alt="Air Jordan sneaker"
        />
      </div>
    </div>
  );
};

export default InteractivePoll;
