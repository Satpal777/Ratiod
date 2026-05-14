import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { API_BASE_URL } from "../constants/index.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { apiRequest } from "../utils/api.js";
import { PollAnalytics } from "../components/PollAnalytics.jsx";

function tokenKey(slug) {
  return `ratiod:${slug}:anonymous-token`;
}

export function PollPage() {
  const { slug } = useParams();
  const { session, authLoading, handleGoogleSignIn } = useAuth();
  const [pollData, setPollData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const poll = pollData?.poll;
  const analytics = pollData?.result;

  useEffect(() => {
    let isMounted = true;

    apiRequest(`/polls/${slug}`)
      .then((data) => {
        if (!isMounted) return;
        setPollData(data);
        setStatus(data.view === "results" ? "Final results are published." : "");
      })
      .catch((requestError) => {
        if (isMounted) setError(requestError.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!poll?.id) return undefined;

    const socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socket.emit("poll:join", poll.id);
    socket.on("poll:analytics", (liveAnalytics) => {
      if (liveAnalytics?.pollId === poll.id) {
        setPollData((current) => current && { ...current, result: liveAnalytics });
      }
    });

    return () => {
      socket.emit("poll:leave", poll.id);
      socket.disconnect();
    };
  }, [poll?.id]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!poll) return;

    setError("");
    setStatus("");
    setLoading(true);

    try {
      const response = await apiRequest(`/polls/${poll.slug}/responses`, {
        method: "POST",
        body: JSON.stringify({
          anonymousSessionToken: localStorage.getItem(tokenKey(poll.slug)),
          answers: Object.entries(answers).map(([questionId, selectedOptionId]) => ({
            questionId,
            selectedOptionId,
          })),
        }),
      });

      if (response.anonymousSessionToken) {
        localStorage.setItem(tokenKey(poll.slug), response.anonymousSessionToken);
      }

      setPollData((current) => current && { ...current, result: response.analytics });
      setStatus("Vote submitted. Thanks for moving the room.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading && !pollData) {
    return (
      <section className="public-poll-section" style={{ maxWidth: '800px', margin: '120px auto', padding: '0 24px' }}>
        <div className="sketch-box" style={{ padding: '64px', textAlign: 'center' }}>
          <p className="sketch-text" style={{ fontSize: '1.5rem', color: 'var(--muted)' }}>Loading poll...</p>
        </div>
      </section>
    );
  }

  if (!poll) {
    return (
      <section className="public-poll-section" style={{ maxWidth: '800px', margin: '120px auto', padding: '0 24px' }}>
        <div className="sketch-box" style={{ padding: '64px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 16px 0' }}>Poll Not Found</h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.2rem', marginBottom: '32px' }}>{error || "This poll link is not available."}</p>
          <Link className="button button-primary" to="/">
            Back home
          </Link>
        </div>
      </section>
    );
  }

  const acceptingResponses =
    pollData.view === "form" && poll.status === "active" && !poll.isExpired;

  return (
    <section className="public-poll-section" style={{ maxWidth: '1120px', margin: '120px auto', padding: '0 24px' }}>
      <div className="public-poll-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>
        <div className="sketch-box" style={{ padding: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="workspace-card-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="sketch-text" style={{ padding: '4px 12px', background: 'var(--warm)', border: '2px solid var(--text)', borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px', display: 'inline-block', marginBottom: '16px', color: 'var(--accent)' }}>
                {poll.mode === "authenticated" ? "Signed voters" : "Anonymous voting"}
              </span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>{poll.title}</h1>
            </div>
            <span style={{ background: poll.isResultPublished ? '#dcfce7' : '#fef2f2', color: poll.isResultPublished ? '#166534' : '#ef4444', border: `2px solid ${poll.isResultPublished ? '#166534' : '#ef4444'}`, padding: '4px 12px', borderRadius: '999px', fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', background: poll.isResultPublished ? '#166534' : '#ef4444', borderRadius: '50%' }} />
              {poll.isResultPublished ? "Published" : poll.status}
            </span>
          </div>

            {poll.description && <p className="public-description">{poll.description}</p>}
            {status && <p className="workspace-notice workspace-notice-success">{status}</p>}
            {error && <p className="workspace-notice workspace-notice-error">{error}</p>}

            {poll.mode === "authenticated" && !session?.user && (
              <div className="auth-callout">
                <p>This poll requires a signed-in response.</p>
                <button
                  className="button button-primary"
                  disabled={authLoading}
                  type="button"
                  onClick={() => handleGoogleSignIn(window.location.pathname)}
                >
                  Sign in with Google
                </button>
              </div>
            )}

            {acceptingResponses ? (
              <form className="response-form" onSubmit={handleSubmit}>
                {poll.questions.map((question) => (
                  <fieldset className="response-question" key={question.id}>
                    <legend>
                      {question.text}
                      {!question.isRequired && <span>Optional</span>}
                    </legend>

                    <div className="response-options">
                      {question.options.map((option) => (
                        <label
                          className={`response-option ${
                            answers[question.id] === option.id ? "response-option-active" : ""
                          }`}
                          key={option.id}
                        >
                          <input
                            checked={answers[question.id] === option.id}
                            name={question.id}
                            type="radio"
                            value={option.id}
                            onChange={() =>
                              setAnswers((current) => ({
                                ...current,
                                [question.id]: option.id,
                              }))
                            }
                          />
                          <span>{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}

                <button
                  className="button button-primary"
                  disabled={loading || (poll.mode === "authenticated" && !session?.user)}
                  type="submit"
                >
                  Submit Vote
                </button>
              </form>
            ) : (
              <p className="sketch-text" style={{ fontSize: '1.2rem', color: 'var(--muted)', textAlign: 'center', margin: '32px 0 0 0' }}>
                This poll is no longer accepting responses.
              </p>
            )}
        </div>

        <div className="sketch-box" style={{ padding: '48px', transform: 'rotate(1deg)' }}>
          <div className="workspace-card-head" style={{ marginBottom: '32px' }}>
            <div>
              <span className="sketch-text" style={{ padding: '4px 12px', background: 'var(--panel)', border: '2px solid var(--text)', borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px', display: 'inline-block', marginBottom: '16px', color: 'var(--teal)' }}>
                {poll.isResultPublished ? "Final outcome" : "Live pulse"}
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: 0 }}>{poll.isResultPublished ? "Results" : "After Vote"}</h2>
            </div>
          </div>

          <PollAnalytics
            analytics={analytics}
            emptyText="Results appear here after submission or publishing."
          />
        </div>
      </div>
    </section>
  );
}
