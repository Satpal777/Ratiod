const Stats = () => {
  return (
    <section className="stats">
      <div className="stats-inner">


        <div className="stat-item">
          <h2 className="stat-number accent-coral">
            40<span className="stat-suffix">M+</span>
          </h2>
          <p className="stat-label">Daily Voters</p>
        </div>

        <div className="stat-divider" />

        <div className="stat-item">
          <h2 className="stat-number accent-blue">
            18.7<span className="stat-suffix">M</span>
          </h2>
          <p className="stat-label">Debates Settled</p>
        </div>

        <div className="stat-divider" />

        <div className="stat-item">
          <h2 className="stat-number accent-yellow">
            99<span className="stat-suffix">%</span>
          </h2>
          <p className="stat-label">Satisfaction Rate</p>
        </div>
      </div>
    </section>
  );
};

export default Stats;
