import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export function ProtectedRoute() {
  const { session, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div style={{ padding: '8rem 2rem 4rem', textAlign: 'center', minHeight: '80vh' }}>
        Loading...
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
