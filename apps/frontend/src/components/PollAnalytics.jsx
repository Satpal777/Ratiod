import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = ["#48f0a4", "#55d8e9", "#d7ff72", "#ffb86b", "#f879a8"];

function cleanLabel(value) {
  return String(value)
    .replaceAll("_", " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <strong>{label || payload[0].name}</strong>
      {payload.map((entry) => (
        <span key={entry.dataKey || entry.name}>
          {entry.name}: {entry.value}
        </span>
      ))}
    </div>
  );
}

function PieStatChart({ items, label, value }) {
  const data = items.filter((item) => item.value > 0);
  const safeData = data.length ? data : [{ label: "No data", value: 1 }];

  return (
    <div className="stat-chart-card">
      <div className="chart-card-head">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="recharts-frame">
        <ResponsiveContainer height={190} width="100%">
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              data={safeData}
              dataKey="value"
              innerRadius="62%"
              nameKey="label"
              outerRadius="86%"
              paddingAngle={3}
              stroke="rgba(6, 16, 13, 0.82)"
              strokeWidth={3}
            >
              {safeData.map((entry, index) => (
                <Cell
                  fill={data.length ? CHART_COLORS[index % CHART_COLORS.length] : "rgba(255,255,255,0.12)"}
                  key={entry.label}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pie-center">
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      </div>

      <div className="chart-legend">
        {items.map((item, index) => (
          <span key={`${item.label}-${index}`}>
            <i style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
            {cleanLabel(item.label)}
          </span>
        ))}
      </div>
    </div>
  );
}

function BarStatChart({ items, label }) {
  const data = items.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
    label: cleanLabel(item.label),
  }));

  return (
    <div className="stat-chart-card">
      <div className="chart-card-head">
        <span>{label}</span>
        <strong>{items.reduce((sum, item) => sum + item.value, 0)}</strong>
      </div>

      <ResponsiveContainer height={210} width="100%">
        <BarChart data={data} margin={{ bottom: 8, left: -18, right: 4, top: 12 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="label"
            interval={0}
            tick={{ fill: "#93a8a0", fontSize: 11, fontWeight: 700 }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            axisLine={false}
            tick={{ fill: "#93a8a0", fontSize: 11, fontWeight: 700 }}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="value" name="Count" radius={[10, 10, 4, 4]}>
            {data.map((entry) => (
              <Cell fill={entry.fill} key={entry.label} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function PollChartPanel({ analytics }) {
  const summaries = analytics.questionSummaries ?? [];
  const firstQuestion = summaries[0];
  const optionItems =
    firstQuestion?.options.map((option) => ({
      label: option.text,
      value: option.count,
    })) ?? [];
  const coverageItems = summaries.map((question, index) => ({
    label: `Q${index + 1}`,
    value: question.answeredCount,
  }));

  if (!firstQuestion && coverageItems.length === 0) return null;

  return (
    <div className="analytics-chart-grid">
      {firstQuestion && (
        <PieStatChart
          items={optionItems}
          label="Top split"
          value={analytics.totalResponses}
        />
      )}
      {coverageItems.length > 0 && (
        <BarStatChart items={coverageItems} label="Question coverage" />
      )}
    </div>
  );
}

export function OverallAnalyticsCharts({ analytics }) {
  if (!analytics) return null;

  const pollItems = (analytics.pollBreakdown ?? []).map((poll) => ({
    label: poll.title.length > 14 ? `${poll.title.slice(0, 14)}...` : poll.title,
    value: poll.responses,
  }));
  const modeItems = (analytics.modeCounts ?? []).map((item) => ({
    label: item.label,
    value: item.value,
  }));
  const statusItems = (analytics.statusCounts ?? []).map((item) => ({
    label: item.label,
    value: item.value,
  }));

  return (
    <div className="analytics-chart-grid analytics-chart-grid-wide">
      <PieStatChart
        items={modeItems.length ? modeItems : [{ label: "No polls", value: 0 }]}
        label="Poll modes"
        value={analytics.totalPolls}
      />
      <BarStatChart
        items={pollItems.length ? pollItems : [{ label: "None", value: 0 }]}
        label="Responses by poll"
      />
      <BarStatChart
        items={statusItems.length ? statusItems : [{ label: "None", value: 0 }]}
        label="Poll status"
      />
    </div>
  );
}

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

      <PollChartPanel analytics={analytics} />

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
