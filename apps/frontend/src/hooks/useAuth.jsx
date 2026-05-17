/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import { authRequest } from "../utils/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState(null);
  const signInWatcherRef = useRef(null);

  const refreshSession = useCallback(async () => {
    try {
      const data = await authRequest("/get-session");
      const nextSession = data?.user ? data : null;
      setSession(nextSession);
      return nextSession;
    } catch {
      setSession(null);
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const stopSignInWatcher = useCallback(() => {
    if (signInWatcherRef.current) {
      window.clearInterval(signInWatcherRef.current);
      signInWatcherRef.current = null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    authRequest("/get-session")
      .then((data) => {
        if (isMounted) setSession(data?.user ? data : null);
      })
      .catch(() => {
        if (isMounted) setSession(null);
      })
      .finally(() => {
        if (isMounted) setAuthLoading(false);
      });

    return () => {
      isMounted = false;
      stopSignInWatcher();
    };
  }, [stopSignInWatcher]);

  const handleGoogleSignIn = async (redirectTo = "/dashboard") => {
    const finalRedirect = typeof redirectTo === 'string' ? redirectTo : '/dashboard';
    const authPopup = window.open(
      "about:blank",
      "ratiod-google-signin",
      "popup=yes,width=520,height=720,left=200,top=80",
    );

    if (!authPopup) {
      window.alert("Please allow popups to sign in with Google.");
      setAuthLoading(false);
      return;
    }

    authPopup.document.title = "Ratio'd sign in";
    authPopup.document.body.innerHTML = "<p style=\"font-family: sans-serif; padding: 24px;\">Preparing Google sign in...</p>";

    setAuthLoading(true);
    try {
      const data = await authRequest("/sign-in/social", {
        body: JSON.stringify({
          provider: "google",
          callbackURL: window.location.origin + finalRedirect,
          errorCallbackURL: window.location.origin,
          newUserCallbackURL: window.location.origin + finalRedirect,
        }),
        method: "POST",
      });

      if (data?.url) {
        stopSignInWatcher();
        authPopup.location.href = data.url;

        signInWatcherRef.current = window.setInterval(async () => {
          if (authPopup.closed) {
            stopSignInWatcher();
            await refreshSession();
            return;
          }

          try {
            const popupUrl = new URL(authPopup.location.href);
            const hasReturnedToApp = popupUrl.origin === window.location.origin && popupUrl.pathname !== "blank";

            if (hasReturnedToApp) {
              authPopup.close();
              stopSignInWatcher();
              const nextSession = await refreshSession();

              if (nextSession?.user && finalRedirect !== window.location.pathname) {
                window.location.assign(finalRedirect);
              }
            }
          } catch {
            // Cross-origin Google pages are expected while OAuth is in progress.
          }
        }, 500);
        return;
      }

      authPopup.close();
      await refreshSession();
    } catch (error) {
      authPopup.close();
      stopSignInWatcher();
      window.alert(error.message);
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    setAuthLoading(true);
    try {
      await authRequest("/sign-out", { method: "POST" });
      setSession(null);
    } catch (error) {
      window.alert(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, authLoading, handleGoogleSignIn, handleSignOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
