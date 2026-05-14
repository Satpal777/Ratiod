export function PollAnalytics({ analytics, emptyText = "Live analytics will appear after the first response." }) {
  if (!analytics) {
    return <p className="empty-state">{emptyText}</p>;
  }

  const summaries = analytics.questionSummaries ?? [];

  return (
    <div className="analytics-stack">
      <div className="metric-grid">
        <div className="metric-tile">
          <span>Total responses</span>
          <strong>{analytics.totalResponses}</strong>
        </div>
        <div className="metric-tile">
          <span>Unique voters</span>
          <strong>{analytics.uniqueRespondents}</strong>
        </div>
        <div className="metric-tile">
          <span>Participation</span>
          <strong>{analytics.participationRate ?? "Live"}</strong>
        </div>
      </div>

      <div className="question-results">
        {summaries.map((question) => (
          <div className="question-result" key={question.id}>
            <div className="question-result-head">
              <h4>{question.text}</h4>
              <span>{question.answeredCount} answered</span>
            </div>

            {question.options.map((option) => (
              <div className="result-row compact-result-row" key={option.id}>
                <div className="result-row-meta">
                  <span>{option.text}</span>
                  <strong>
                    {option.count} / {option.percentage}%
                  </strong>
                </div>
                <div className="result-track">
                  <div
                    className="result-fill"
                    style={{ width: `${option.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
