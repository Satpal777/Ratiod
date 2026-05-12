import InteractivePoll from './InteractivePoll';

const Hero = () => {
  return (
    <header className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-eyebrow animate-fade-in-up">
            <span className="eyebrow-pill">🔥 50M+ polls created worldwide</span>
          </div>

          <h1 className="hero-title animate-fade-in-up delay-1">
            Your Voice,<br />
            <span className="highlight-text">Quantified.</span>
          </h1>
          <p className="hero-subtitle animate-fade-in-up delay-2">
            Settle any debate in seconds. Create interactive polls, drive
            engagement, and discover what the world really thinks.
          </p>
          <div className="hero-cta animate-fade-in-up delay-3">
            <button className="btn btn-accent btn-large">
              Create a Poll <span className="arrow">→</span>
            </button>
            <button className="btn btn-outline btn-large">
              Explore Trending
            </button>
          </div>

          <div className="hero-social-proof animate-fade-in-up delay-4">
            <div className="avatar-stack">
              <div className="avatar" style={{ background: '#FF4B35' }}></div>
              <div className="avatar" style={{ background: '#3D7EFF' }}></div>
              <div className="avatar" style={{ background: '#DFF23A' }}></div>
              <div className="avatar" style={{ background: '#FF9B36' }}></div>
              <div className="avatar" style={{ background: '#B054FF' }}></div>
            </div>
            <p className="social-proof-text">
              Joined by <strong>40M+</strong> daily voters worldwide
            </p>
          </div>
        </div>

        <div className="hero-poll-widget animate-fade-in-up delay-2">
          <InteractivePoll />
        </div>
      </div>
    </header>
  );
};

export default Hero;
