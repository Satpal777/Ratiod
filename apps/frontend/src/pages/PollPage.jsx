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
      <section className="public-poll-section">
        <div className="shell-card">
          <div className="shell-inner public-poll-card">
            <p className="empty-state">Loading poll...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!poll) {
    return (
      <section className="public-poll-section">
        <div className="shell-card">
          <div className="shell-inner public-poll-card">
            <h1>Poll Not Found</h1>
            <p className="empty-state">{error || "This poll link is not available."}</p>
            <Link className="button button-primary" to="/">
              Back home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const acceptingResponses =
    pollData.view === "form" && poll.status === "active" && !poll.isExpired;

  return (
    <section className="public-poll-section">
      <div className="public-poll-grid">
        <div className="shell-card">
          <div className="shell-inner public-poll-card">
            <div className="workspace-card-head">
              <div>
                <span className="panel-kicker">
                  {poll.mode === "authenticated" ? "Signed voters" : "Anonymous voting"}
                </span>
                <h1>{poll.title}</h1>
              </div>
              <span className="live-pill">
                <span className="live-dot" />
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
              <p className="empty-state">
                This poll is no longer accepting responses.
              </p>
            )}
          </div>
        </div>

        <div className="shell-card">
          <div className="shell-inner public-poll-card analytics-card">
            <div className="workspace-card-head">
              <div>
                <span className="panel-kicker">
                  {poll.isResultPublished ? "Final outcome" : "Live pulse"}
                </span>
                <h2>{poll.isResultPublished ? "Results" : "After Vote"}</h2>
              </div>
            </div>

            <PollAnalytics
              analytics={analytics}
              emptyText="Results appear here after submission or publishing."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
