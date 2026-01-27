import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

const VerifyEmail = () => {
  const { token } = useParams(); // Captures :token from URL
  const [status, setStatus] = useState("verifying"); // verifying, success, error

  useEffect(() => {
    const verify = async () => {
      try {
        // Targets Backend Route: GET /api/v1/auth/verify-email/:verificationToken
        await api.get(`/auth/verify-email/${token}`);
        setStatus("success");
      } catch (error) {
        console.error("Verification failed", error);
        setStatus("error");
      }
    };

    if (token) {
      verify();
    }
  }, [token]);

  return (
    // Fixed Background: Permanent Dark (Gray 950)
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-xl shadow-2xl shadow-black/50 text-center border border-gray-800">
        {status === "verifying" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-white">
              Verifying your email...
            </h2>
            <p className="text-gray-400 mt-2">
              Please wait while we confirm your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="bg-green-900/30 text-green-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-900/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
            <p className="text-gray-400 mt-2 mb-6">
              Your account is now active. You can proceed to login.
            </p>
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-500 transition block w-full sm:w-auto mx-auto"
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="bg-red-900/30 text-red-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-900/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Verification Failed
            </h2>
            <p className="text-gray-400 mt-2 mb-6">
              The link is invalid or has expired.
            </p>
            <Link
              to="/register"
              className="text-indigo-400 font-medium hover:text-indigo-300 hover:underline"
            >
              Try registering again
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
