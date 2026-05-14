import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../constants/index.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { apiRequest } from "../utils/api.js";
import {
  OverallAnalyticsCharts,
  PollAnalytics,
} from "../components/PollAnalytics.jsx";
import { Icon } from "../components/ui/Icon.jsx";

// Helpers
function createQuestion() {
  return { text: "", isRequired: true, options: ["", ""] };
}

function createDraft() {
  return { title: "", description: "", mode: "anonymous", expiresAt: "", questions: [createQuestion()] };
}

function shareUrl(slug) {
  return `${window.location.origin}/poll/${slug}`;
}

function formatDate(value) {
  if (!value) return "No expiry";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function DashboardPage() {
  const { session, handleSignOut } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("view"); // 'view', 'create', 'analytics'
  const [draft, setDraft] = useState(() => createDraft());
  const [polls, setPolls] = useState([]);
  const [activePollId, setActivePollId] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [overallAnalytics, setOverallAnalytics] = useState(null);
  const [voters, setVoters] = useState(null);

  const [answeredPolls, setAnsweredPolls] = useState([]);

  const [status, setStatusState] = useState("");
  const [error, setErrorState] = useState("");
  const [loading, setLoading] = useState(false);

  function setStatus(msg) {
    setStatusState(msg);
    if (msg) setTimeout(() => setStatusState(""), 4000);
  }

  function setError(msg) {
    setErrorState(msg);
    if (msg) setTimeout(() => setErrorState(""), 4000);
  }

  const activePoll = polls.find((poll) => poll.id === activePollId);

  // Fetch polls
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      apiRequest("/polls").catch(() => ({ polls: [] })),
      apiRequest("/polls/answered").catch(() => ({ polls: [] }))
    ]).then(([createdData, answeredData]) => {
      if (!isMounted) return;
      const nextPolls = createdData.polls ?? [];
      setPolls(nextPolls);
      setAnsweredPolls(answeredData.polls ?? []);
      setActivePollId((current) => current || nextPolls[0]?.id || "");
    });
    return () => { isMounted = false; };
  }, []);

  // Fetch overall analytics
  useEffect(() => {
    if (activeTab === "analytics") {
      let isMounted = true;
      apiRequest("/polls/analytics/overall").then(data => {
        if (isMounted) setOverallAnalytics(data.analytics);
      }).catch(err => { if (isMounted) setError(err.message); });
      return () => { isMounted = false; };
    }
  }, [activeTab]);

  // Socket
  useEffect(() => {
    if (!activePollId || activeTab !== "view") return;
    const socket = io(API_BASE_URL, { transports: ["websocket", "polling"], withCredentials: true });
    socket.emit("poll:join", activePollId);
    socket.on("poll:analytics", (liveAnalytics) => {
      if (liveAnalytics?.pollId === activePollId) setAnalytics(liveAnalytics);
    });
    return () => {
      socket.emit("poll:leave", activePollId);
      socket.disconnect();
    };
  }, [activePollId, activeTab]);

  // Fetch specific analytics and voters
  useEffect(() => {
    if (!activePollId || activeTab !== "view") return;
    let isMounted = true;
    apiRequest(`/polls/${activePollId}/analytics`).then(data => {
      if (isMounted) setAnalytics(data.analytics);
    }).catch(err => { if (isMounted) setError(err.message); });
    
    // Fetch voters if authenticated
    const poll = polls.find(p => p.id === activePollId);
    if (poll?.mode === 'authenticated') {
      apiRequest(`/polls/${activePollId}/voters`).then(data => {
        if (isMounted) setVoters(data.voters);
      }).catch(() => { if (isMounted) setVoters(null); });
    } else {
      Promise.resolve().then(() => {
        if (isMounted) setVoters(null);
      });
    }

    return () => { isMounted = false; };
  }, [activePollId, activeTab, polls]);

  function updateQuestion(questionIndex, patch) {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question, index) => index === questionIndex ? { ...question, ...patch } : question),
    }));
  }

  function updateOption(questionIndex, optionIndex, value) {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question, index) => {
        if (index !== questionIndex) return question;
        return {
          ...question,
          options: question.options.map((option, nextIndex) => nextIndex === optionIndex ? value : option),
        };
      }),
    }));
  }

  function addOption(questionIndex) {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question, index) => index === questionIndex ? { ...question, options: [...question.options, ""] } : question),
    }));
  }

  function removeOption(questionIndex, optionIndex) {
    setDraft((current) => ({
      ...current,
      questions: current.questions.map((question, index) => {
        if (index !== questionIndex || question.options.length <= 2) return question;
        return { ...question, options: question.options.filter((_, nextIndex) => nextIndex !== optionIndex) };
      }),
    }));
  }

  async function handleCreatePoll(event) {
    event.preventDefault();
    setError(""); setStatus(""); setLoading(true);
    try {
      const data = await apiRequest("/polls", {
        method: "POST",
        body: JSON.stringify({ ...draft, expiresAt: draft.expiresAt || null }),
      });
      const refreshData = await apiRequest("/polls");
      setPolls(refreshData.polls ?? []);
      setActivePollId(data.poll.id);
      setDraft(createDraft());
      setAnalytics(null);
      setStatus(`Poll created successfully.`);
      setActiveTab("view");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!activePollId) return;
    setError(""); setStatus(""); setLoading(true);
    try {
      const data = await apiRequest(`/polls/${activePollId}/publish`, { method: "POST" });
      setAnalytics(data.analytics);
      setStatus("Final results are now public on the poll link.");
      const refreshData = await apiRequest("/polls");
      setPolls(refreshData.polls ?? []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleTerminate() {
    if (!activePollId) return;
    setError(""); setStatus(""); setLoading(true);
    try {
      await apiRequest(`/polls/${activePollId}/terminate`, { method: "POST" });
      setStatus("Poll has been manually closed and is no longer accepting responses.");
      const refreshData = await apiRequest("/polls");
      setPolls(refreshData.polls ?? []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <span className="brand-dot" /> Ratio'd
        </Link>

        <nav className="dashboard-nav">
          <button className={`dashboard-nav-item ${activeTab === 'view' ? 'dashboard-nav-item-active' : ''}`} onClick={() => setActiveTab('view')}>
            <Icon name="chart" /> View Polls
          </button>
          <button className={`dashboard-nav-item ${activeTab === 'create' ? 'dashboard-nav-item-active' : ''}`} onClick={() => setActiveTab('create')}>
            <Icon name="bolt" /> Create Poll
          </button>
          <button className={`dashboard-nav-item ${activeTab === 'analytics' ? 'dashboard-nav-item-active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <Icon name="mask" /> Analytics
          </button>
        </nav>

        <div className="dashboard-user">
          <div className="dashboard-user-avatar">
            {session?.user?.image ? (
              <img src={session.user.image} alt={session.user.name} />
            ) : (
              (session?.user?.name || "U")[0].toUpperCase()
            )}
          </div>
          <div className="dashboard-user-info">
            <span className="dashboard-user-name">{session?.user?.name}</span>
            <button className="dashboard-user-logout" onClick={async () => { await handleSignOut(); navigate("/"); }}>
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="workspace-alerts">
          {status && <p className="workspace-notice workspace-notice-success">{status}</p>}
          {error && <p className="workspace-notice workspace-notice-error">{error}</p>}
        </div>

        {activeTab === 'create' && (
          <div className="dashboard-card builder-card" style={{ maxWidth: 800 }}>
            <form className="dashboard-card-inner" onSubmit={handleCreatePoll}>
              <div className="workspace-card-head">
                <div>
                  <span className="panel-kicker">Poll builder</span>
                  <h2>Create Poll</h2>
                </div>
              </div>
              
              <label className="field-label">
                Poll title
                <input required value={draft.title} onChange={(e) => setDraft((c) => ({ ...c, title: e.target.value }))} placeholder="Which feature should ship first?" />
              </label>

              <label className="field-label">
                Description
                <textarea value={draft.description} onChange={(e) => setDraft((c) => ({ ...c, description: e.target.value }))} placeholder="Give voters one short line of context." />
              </label>

              <div className="field-grid">
                <label className="field-label">
                  Response mode
                  <select value={draft.mode} onChange={(e) => setDraft((c) => ({ ...c, mode: e.target.value }))}>
                    <option value="anonymous">Anonymous</option>
                    <option value="authenticated">Authenticated</option>
                  </select>
                </label>
                <label className="field-label">
                  Expiry
                  <input type="datetime-local" value={draft.expiresAt} onChange={(e) => setDraft((c) => ({ ...c, expiresAt: e.target.value }))} />
                </label>
              </div>

              <div className="question-builder-list">
                {draft.questions.map((q, qIdx) => (
                  <div className="question-builder" key={`q-${qIdx}`}>
                    <div className="question-builder-head">
                      <strong>Question {qIdx + 1}</strong>
                      <label className="checkbox-label">
                        <input checked={q.isRequired} type="checkbox" onChange={(e) => updateQuestion(qIdx, { isRequired: e.target.checked })} />
                        Mandatory
                      </label>
                    </div>
                    <input required value={q.text} onChange={(e) => updateQuestion(qIdx, { text: e.target.value })} placeholder="Ask a clear question" />
                    <div className="option-list">
                      {q.options.map((opt, oIdx) => (
                        <div className="option-editor" key={`o-${qIdx}-${oIdx}`}>
                          <input required value={opt} onChange={(e) => updateOption(qIdx, oIdx, e.target.value)} placeholder={`Option ${oIdx + 1}`} />
                          <button className="mini-action" disabled={q.options.length <= 2} type="button" onClick={() => removeOption(qIdx, oIdx)}>Remove</button>
                        </div>
                      ))}
                    </div>
                    <button className="button button-secondary compact-button" type="button" onClick={() => addOption(qIdx)}>Add option</button>
                  </div>
                ))}
              </div>

              <div className="builder-actions">
                <button className="button button-secondary" type="button" onClick={() => setDraft((c) => ({ ...c, questions: [...c.questions, createQuestion()] }))}>Add question</button>
                <button className="button button-primary" disabled={loading} type="submit">Create Poll</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'view' && (
          <div className="view-polls-layout">
            <div className="dashboard-card view-polls-list">
              <div className="dashboard-card-inner poll-list-card">
                <div className="workspace-card-head">
                  <div>
                    <span className="panel-kicker">Your polls</span>
                    <h2>All Polls</h2>
                  </div>
                </div>
                <div className="poll-list">
                  {polls.length === 0 && <p className="empty-state">No polls created yet.</p>}
                  {polls.map((poll) => (
                    <button className={`poll-list-item ${activePollId === poll.id && activeTab !== 'voters-detail' ? "poll-list-item-active" : ""}`} key={poll.id} type="button" onClick={() => { setActivePollId(poll.id); setActiveTab('view'); }}>
                      <span>
                        <strong>{poll.title}</strong>
                        <small>{formatDate(poll.expiresAt)}</small>
                      </span>
                      <em>{poll.isResultPublished ? "Published" : poll.status}</em>
                    </button>
                  ))}
                </div>
                <div className="poll-list" style={{ marginTop: '32px' }}>
                  <h3 style={{ fontSize: '0.9rem', opacity: 0.6, marginBottom: '12px', paddingLeft: '14px' }}>Answered Polls</h3>
                  {answeredPolls.length === 0 && <p className="empty-state" style={{ paddingLeft: '14px' }}>No answered polls yet.</p>}
                  {answeredPolls.map((poll) => (
                    <Link className="poll-list-item" key={poll.id} to={`/poll/${poll.slug}`} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <span>
                        <strong>{poll.title}</strong>
                        <small>Submitted: {formatDate(poll.submittedAt)}</small>
                      </span>
                      <em style={{ opacity: poll.isResultPublished ? 1 : 0.5 }}>
                        {poll.isResultPublished ? "Results Available" : "Results Hidden"}
                      </em>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {activePoll && (
              <div className="dashboard-card view-poll-details">
                <div className="dashboard-card-inner analytics-card">
                  <div className="workspace-card-head">
                    <div>
                      <span className="panel-kicker">Live Link</span>
                      <h2>{activePoll.title}</h2>
                    </div>
                    <a className="share-link" href={shareUrl(activePoll.slug)} target="_blank" rel="noreferrer">Open link</a>
                  </div>

                  <div className="share-box">
                    <span>Public URL</span>
                    <code>{shareUrl(activePoll.slug)}</code>
                  </div>

                  <PollAnalytics analytics={analytics} />

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                    <button className="button button-primary" disabled={loading} onClick={handlePublish}>Publish Results</button>
                    {activePoll.mode === 'authenticated' && voters && voters.length > 0 && (
                      <button className="button button-secondary" onClick={() => setActiveTab('voters-detail')}>
                        View Details
                      </button>
                    )}
                    {activePoll.status === 'active' && !activePoll.isExpired && (
                      <button className="button button-secondary" style={{ color: 'var(--accent)', borderColor: 'var(--accent)' }} disabled={loading} onClick={handleTerminate}>
                        Close Poll
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'voters-detail' && activePoll && voters && (
          <div className="dashboard-card view-voters-layout">
            <div className="dashboard-card-inner">
              <div className="workspace-card-head" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="panel-kicker">Detailed Overview</span>
                  <h2>Voter Records</h2>
                  <p className="sketch-text" style={{ margin: '8px 0 0 0', color: 'var(--muted)' }}>For poll: {activePoll.title}</p>
                </div>
                <button className="button button-secondary" onClick={() => setActiveTab('view')}>
                  Back to Poll
                </button>
              </div>

              <div className="sketch-table-wrapper" style={{ overflowX: 'auto', border: '2px solid var(--text)', borderRadius: '16px', background: 'var(--bg)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--panel)', borderBottom: '2px solid var(--text)' }}>
                      <th style={{ padding: '16px', fontWeight: 800 }}>Voter</th>
                      <th style={{ padding: '16px', fontWeight: 800 }}>Date</th>
                      {analytics?.questionSummaries?.map((q, i) => (
                        <th key={q.id} style={{ padding: '16px', fontWeight: 800 }}>Q{i + 1}: {q.text}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {voters.map((voter) => (
                      <tr key={voter.responseId} style={{ borderBottom: '1px dashed var(--line-strong)' }}>
                        <td style={{ padding: '16px', minWidth: '200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={voter.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(voter.user.name)}`} alt={voter.user.name} style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--text)' }} />
                            <div>
                              <strong style={{ display: 'block', fontSize: '0.9rem' }}>{voter.user.name}</strong>
                              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{voter.user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--muted)', minWidth: '150px' }}>
                          {new Date(voter.submittedAt).toLocaleString()}
                        </td>
                        {analytics?.questionSummaries?.map((q) => {
                          const ans = voter.answers.find(a => a.questionId === q.id);
                          const opt = q.options?.find(o => o.id === ans?.optionId);
                          return (
                            <td key={q.id} style={{ padding: '16px', fontSize: '0.9rem', minWidth: '200px' }}>
                              {opt ? (
                                <span style={{ background: 'var(--warm)', padding: '4px 8px', borderRadius: '8px', border: '1px solid var(--line-strong)' }}>
                                  {opt.text}
                                </span>
                              ) : (
                                <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Skipped</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="dashboard-card" style={{ maxWidth: 800 }}>
            <div className="dashboard-card-inner analytics-card">
              <div className="workspace-card-head">
                <div>
                  <span className="panel-kicker">Account Analytics</span>
                  <h2>Overall Usage</h2>
                </div>
              </div>
              
              {!overallAnalytics ? (
                <p className="empty-state">Loading overall analytics...</p>
              ) : (
                <div className="analytics-stack">
                  <div className="metric-grid">
                    <div className="metric-tile">
                      <span>Total Polls Created</span>
                      <strong>{overallAnalytics.totalPolls}</strong>
                    </div>
                    <div className="metric-tile">
                      <span>Total Responses</span>
                      <strong>{overallAnalytics.totalResponses}</strong>
                    </div>
                    <div className="metric-tile">
                      <span>Unique Voters</span>
                      <strong>{overallAnalytics.uniqueRespondents}</strong>
                    </div>
                    <div className="metric-tile">
                      <span>Published Polls</span>
                      <strong>{overallAnalytics.publishedPolls}</strong>
                    </div>
                  </div>

                  <OverallAnalyticsCharts analytics={overallAnalytics} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
