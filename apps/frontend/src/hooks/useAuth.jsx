/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { authRequest } from "../utils/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [session, setSession] = useState(null);

  const refreshSession = useCallback(async () => {
    try {
      const data = await authRequest("/get-session");
      setSession(data?.user ? data : null);
    } catch {
      setSession(null);
    } finally {
      setAuthLoading(false);
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
    };
  }, []);

  const handleGoogleSignIn = async (redirectTo = "/dashboard") => {
    const finalRedirect = typeof redirectTo === 'string' ? redirectTo : '/dashboard';
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
        window.location.assign(data.url);
        return;
      }
      await refreshSession();
    } catch (error) {
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
