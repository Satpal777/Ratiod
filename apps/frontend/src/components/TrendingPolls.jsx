import { useState } from 'react';

const pollsData = [
  {
    id: 'pizza',
    category: '🍕 Food Debates',
    title: 'Best Pizza Topping of All Time?',
    desc: "Time to settle this once and for all. What's the undisputed champion of pizza toppings?",
    options: ['Pepperoni', 'Pineapple (heretics)'],
    votes: '142K votes',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=800&auto=format&fit=crop',
    live: true,
  },
  {
    id: 'vacation',
    category: '✈️ Travel & Leisure',
    title: 'Best Vacation Destination?',
    desc: 'If you could go anywhere right now, where would it be? Choose your perfect escape.',
    options: ['Mountain Retreat', 'Beach Resort'],
    votes: '98K votes',
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=800&auto=format&fit=crop',
    live: false,
  },
];

const PollCard = ({ poll }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="poll-preview-card">
      <div className="poll-preview-image">
        <img src={poll.image} alt={poll.title} />
      </div>
      <div className="poll-preview-content">
        <div className="poll-meta">
          <span className="poll-category">{poll.category}</span>
          {poll.live && (
            <span className="poll-live-badge">
              <span className="poll-live-dot"></span>
              LIVE
            </span>
          )}
        </div>

        <h3 className="poll-preview-title">{poll.title}</h3>
        <p className="poll-preview-desc">{poll.desc}</p>

        <div className="poll-options-list">
          {poll.options.map((opt) => (
            <label
              key={opt}
              className={`poll-option-radio ${selected === opt ? 'selected' : ''}`}
              onClick={() => setSelected(opt)}
            >
              <input type="radio" name={poll.id} value={opt} readOnly />
              <span className="radio-custom"></span>
              {opt}
            </label>
          ))}
        </div>

        <div className="poll-footer">
          <span className="poll-vote-count">{poll.votes}</span>
          <button className="btn btn-accent btn-sm">Vote Now</button>
        </div>
      </div>
    </div>
  );
};

const TrendingPolls = () => (
  <section className="trending section-padding">
    <div className="trending-header">
      <div>
        <p className="section-label">Community</p>
        <h2 className="section-title">Trending Polls</h2>
        <p className="section-subtitle">See what the world is debating right now.</p>
      </div>
      <button className="btn btn-ghost">
        View All Polls <span className="arrow">→</span>
      </button>
    </div>

    <div className="trending-grid">
      {pollsData.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  </section>
);

export default TrendingPolls;
