import { Routes, Route } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout.jsx";
import { LandingPage } from "../pages/LandingPage.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { PollPage } from "../pages/PollPage.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="poll/:slug" element={<PollPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
