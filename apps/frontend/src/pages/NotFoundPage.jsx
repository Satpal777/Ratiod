import { Link } from "react-router-dom";
import { ShellCard, ShellInner } from "../components/ui/Card.jsx";

export function NotFoundPage() {
  return (
    <section className="not-found-section" style={{ padding: '8rem 2rem 4rem', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ShellCard>
        <ShellInner style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>404 - Page Not Found</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="button button-primary">
            Return Home
          </Link>
        </ShellInner>
      </ShellCard>
    </section>
  );
}
