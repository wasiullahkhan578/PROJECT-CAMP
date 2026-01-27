import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        // Backend API Call to verify token
        // URL should match your backend route structure (e.g., /auth/verify-email/:token)
        await api.get(`/auth/verify-email/${token}`);
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch (error) {
        setStatus("error");
        toast.error(error.response?.data?.message || "Verification failed");
      }
    };

    if (token) {
      verifyAccount();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950 text-white">
      <div className="max-w-100 w-full bg-gray-900 p-8 rounded-4xl border border-gray-800 shadow-2xl text-center">
        {/* CASE 1: VERIFYING (Loading) */}
        {status === "verifying" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-black text-white">Verifying...</h2>
            <p className="text-gray-400 text-sm mt-2">
              Please wait while we verify your email.
            </p>
          </div>
        )}

        {/* CASE 2: SUCCESS */}
        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white">Verified!</h2>
            <p className="text-gray-400 text-sm mt-2 mb-8">
              Your account has been successfully verified.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-900/20"
            >
              Go to Login
            </button>
          </div>
        )}

        {/* CASE 3: ERROR */}
        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white">
              Verification Failed
            </h2>
            <p className="text-gray-400 text-sm mt-2 mb-8">
              The link may be invalid or expired.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3.5 rounded-2xl font-bold transition-all border border-gray-700"
            >
              Back to Register
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
