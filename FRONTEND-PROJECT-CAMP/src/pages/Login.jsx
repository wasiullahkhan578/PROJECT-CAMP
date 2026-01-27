import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  // Removed useTheme hook
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fixed Background: Permanent Dark (Gray 950)
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative bg-gray-950 text-white">
      {/* BACK BUTTON */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <button
          onClick={() => navigate("/")}
          className="font-bold text-sm text-gray-500 hover:text-indigo-400 transition flex items-center gap-1"
        >
          <span className="text-lg">←</span> Home
        </button>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-105 bg-gray-900 p-8 sm:p-10 rounded-4xl sm:rounded-[3rem] border border-gray-800 shadow-2xl shadow-black/50">
        <div className="mb-8">
          <h2 className="text-3xl font-black mb-2 tracking-tight text-white">
            Sign In.
          </h2>
          <p className="text-sm text-gray-400 font-medium">
            Please enter your details to access your camp.
          </p>
        </div>

        <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              className="w-full p-4 bg-gray-800 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm border border-gray-700 focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-4 bg-gray-800 text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm border border-gray-700 focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-900/20 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Connecting..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 font-bold">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
