import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // ✅ NEW STATE: Tracks if email is sent
  const [isEmailSent, setIsEmailSent] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/register", formData);

      // ✅ SUCCESS: Don't navigate yet. Show email sent screen.
      setIsEmailSent(true);
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
          className="flex items-center gap-2 font-bold text-gray-500 hover:text-indigo-400 transition-all group text-sm"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span className="hidden sm:block">Back to Home</span>
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-110 w-full space-y-6 md:space-y-8 bg-gray-900 p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-gray-800 shadow-2xl shadow-black/50"
      >
        {/* ✅ CONDITIONAL RENDERING */}
        {isEmailSent ? (
          // 1. EMAIL SENT SCREEN
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-indigo-900/30 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-900/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              Check your email
            </h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              We've sent a verification link to <br />
              <span className="text-white font-bold">{formData.email}</span>
            </p>
            <p className="text-gray-500 text-xs mb-8">
              Click the link in the email to activate your account.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white py-3 rounded-2xl font-bold transition-all border border-indigo-600/20"
            >
              Go to Login Page →
            </button>
          </div>
        ) : (
          // 2. REGISTRATION FORM (Existing Code)
          <>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
                Join the <span className="text-indigo-500">Camp.</span>
              </h2>
              <p className="mt-2 text-sm text-gray-400 font-medium">
                Start managing your team projects today.
              </p>
            </div>

            <form
              className="mt-6 md:mt-8 space-y-4 md:space-y-5"
              onSubmit={handleSubmit}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                    Username
                  </label>
                  <input
                    name="username"
                    type="text"
                    required
                    className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm focus:border-transparent"
                    placeholder="wasi_dev"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm focus:border-transparent"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm focus:border-transparent"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 transition-all transform active:scale-[0.98] text-sm md:text-base ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Creating account..." : "Register Now"}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Already a member?{" "}
                <Link
                  to="/login"
                  className="text-indigo-400 font-bold hover:underline"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
