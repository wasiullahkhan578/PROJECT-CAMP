import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your email!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white relative">
      {/* Back Button */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 font-bold text-gray-500 hover:text-indigo-400 transition-all text-sm"
        >
          <span>←</span> Back to Login
        </button>
      </div>

      <div className="w-full max-w-105 bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Forgot Password?
          </h2>
          <p className="text-sm text-gray-400 font-medium">
            Don't worry! It happens. Please enter the email associated with your
            account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 transition-all active:scale-[0.98] ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
