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

  return (
    <div className="page-shell">
      <div className="page-noise" />
      <div className="background-grid" />

      {!isDashboard && (
        <header className={`topbar-wrap ${isNavbarScrolled ? "topbar-scrolled" : ""}`}>
        <div className="topbar">
          <Link className="brand-mark" to="/">
            <span className="brand-dot" />
            Ratio'd
          </Link>

          <nav className="nav-links" aria-label="Primary">
            {navLinks.map((link) => (
              <a href="/" key={link} onClick={(e) => e.preventDefault()}>
                {link}
              </a>
            ))}
          </nav>

          <div className="topbar-actions" style={{ display: 'flex', gap: '8px' }}>
            {session?.user ? (
              <>
                <Link to="/dashboard" className="button button-primary">
                  Dashboard
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
