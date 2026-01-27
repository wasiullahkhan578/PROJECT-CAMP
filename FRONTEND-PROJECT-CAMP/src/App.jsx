import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
// Removed useTheme import
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";

function App() {
  const { user, loading } = useAuth();
  // Removed theme hook

  // Loading state: Dark background with Indigo text
  if (loading)
    return (
      <div className="flex h-screen items-center justify-center font-black text-indigo-500 bg-gray-950">
        Connecting to camp...
      </div>
    );

  return (
    // Main App Wrapper: Permanent Dark Mode (Gray 950)
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Dark Themed Toasts */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#111827", // Gray 900
            color: "#fff",
            border: "1px solid #1f2937", // Gray 800
          },
        }}
      />

      <Routes>
        {/* 1. Public Landing Page */}
        <Route path="/" element={<Home />} />

        {/* 2. Authentication Routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" replace />}
        />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* 3. Protected Routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/project/:projectId"
          element={user ? <ProjectDetails /> : <Navigate to="/" replace />}
        />

        {/* 4. Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
