import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";

// ✅ NEW IMPORTS (Ye pages maine pichle steps mein banwaye thay)
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center font-black text-indigo-500 bg-gray-950">
        Connecting to camp...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid #1f2937",
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

        {/* ✅ Email Verification Route */}
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* ✅ Forgot Password Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

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
