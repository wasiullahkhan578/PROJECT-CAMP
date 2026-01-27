import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend expects 'password' in body
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful! You can now login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
      <div className="w-full max-w-105 bg-gray-900 p-8 sm:p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            New Password.
          </h2>
          <p className="text-sm text-gray-400 font-medium">
            Your identity has been verified. Set your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
              New Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full p-4 bg-gray-800 text-white border border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm focus:border-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 transition-all active:scale-[0.98] ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
