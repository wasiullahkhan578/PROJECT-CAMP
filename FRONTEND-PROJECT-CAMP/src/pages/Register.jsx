import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  // Removed useTheme hook
  const [loading, setLoading] = useState(false);
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
      toast.success(
        "Registration successful! Please check your email to verify your account.",
      );
      navigate("/login");
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
      </motion.div>
    </div>
  );
};

export default Register;
