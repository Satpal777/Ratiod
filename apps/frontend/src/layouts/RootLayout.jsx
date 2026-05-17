import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useScroll } from "../hooks/useScroll.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { navLinks } from "../constants/index.js";
import { Icon } from "../components/ui/Icon.jsx";

export function RootLayout() {
  const isNavbarScrolled = useScroll(18);
  const { session, authLoading, handleGoogleSignIn, handleSignOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const scrollToSection = (event, href) => {
    const [, sectionId] = href.split("#");

    if (!sectionId || location.pathname !== "/") {
      return;
    }

    const section = document.getElementById(sectionId);

    if (section) {
      event.preventDefault();
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", href);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-noise" />
      <div className="background-grid" />

      {!isDashboard && (
        <header className={`topbar-wrap ${isNavbarScrolled ? "topbar-scrolled" : ""}`}>
        <div className="topbar">
          <Link className="brand-mark" to="/">
            <img className="brand-dot" src="/favicon.png" alt="" aria-hidden="true" />
            Ratio'd
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {navLinks.map((link) => (
              <a
                href={link.href}
                key={link.label}
                onClick={(event) => scrollToSection(event, link.href)}
                rel={link.external ? "noreferrer" : undefined}
                target={link.external ? "_blank" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="topbar-actions" style={{ display: 'flex', gap: '8px' }}>
            {session?.user ? (
              <>
                <Link to="/dashboard" className="button button-primary" style={{ padding: '8px 24px', borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px', border: '2px solid var(--text)' }}>
                  Go to Dashboard
                  <span className="button-icon">
                    <Icon name="arrow" />
                  </span>
                </Link>
                <button
                  className="button button-secondary"
                  style={{ padding: '0', width: '44px', height: '44px', borderRadius: '50%' }}
                  disabled={authLoading}
                  onClick={async () => {
                    await handleSignOut();
                    navigate("/");
                  }}
                  title="Sign Out"
                  type="button"
                >
                  <Icon name="logout" />
                </button>
              </>
            ) : (
              <button
                className="button button-secondary topbar-cta"
                disabled={authLoading}
                onClick={handleGoogleSignIn}
                type="button"
              >
                Sign in with Google
                <span className="button-icon">
                  <Icon name="arrow" />
                </span>
              </button>
            )}
          </div>
        </div>
      </header>
      )}

      <main style={{ padding: isDashboard ? '0' : undefined, maxWidth: isDashboard ? '100%' : undefined }}>
        <Outlet />
      </main>
    </div>
  );
}
