const steps = [
  {
    num: '01',
    color: 'var(--accent-coral)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    title: 'Create',
    desc: 'Write your question, add your options, and customize the visual theme to match your brand or energy.',
  },
  {
    num: '02',
    color: 'var(--accent-blue)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
    title: 'Share',
    desc: 'Share across social media, embed it on your website, or drop it into a group chat — instantly.',
  },
  {
    num: '03',
    color: 'var(--accent)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Get Results',
    desc: 'Watch votes roll in with real-time analytics, demographic breakdowns, and beautiful data visualizations.',
  },
];

const Steps = () => (
  <section className="steps section-padding">
    <div className="steps-header">
      <p className="section-label">How It Works</p>
      <h2 className="section-title">Polling Made Simple</h2>
      <p className="section-subtitle">Three steps to discover the world's opinion.</p>
    </div>

    <div className="steps-grid">
      {steps.map((step) => (
        <div
          className="step-card"
          key={step.num}
          style={{ '--step-color': step.color }}
        >
          <div className="step-num-bg">{step.num}</div>
          <div className="step-icon-wrap">{step.icon}</div>
          <h3 className="step-title">{step.title}</h3>
          <p className="step-desc">{step.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Steps;
