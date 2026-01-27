import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard");
  }, [user, navigate]);

  return (
    // Fixed Background: Permanent Dark (Gray 950)
    <div className="w-full min-h-screen bg-gray-950 text-white selection:bg-indigo-500 selection:text-white">
      {/* HERO SECTION */}
      <section className="flex flex-col justify-center items-center px-6 md:px-8 py-20 md:py-32 relative overflow-hidden">
        {/* NAV */}
        <nav className="absolute top-0 left-0 w-full px-6 md:px-12 py-6 md:py-10 flex justify-between items-center z-20">
          <div className="text-xl md:text-2xl font-black tracking-tighter text-indigo-500">
            Project Camp.
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <Link
              to="/login"
              className="font-bold text-xs md:text-sm text-gray-300 hover:text-white transition-colors"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full font-bold text-xs md:text-sm shadow-lg shadow-indigo-900/20 hover:bg-indigo-500 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* HERO CONTENT */}
        <div className="text-center max-w-4xl px-2 mt-16 md:mt-12">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter mb-6 md:mb-8 leading-[1.1] text-white"
          >
            Manage projects <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-800 to-cyan-600">
              collaboratively.
            </span>
          </motion.h1>

          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed">
            The all-in-one platform to organize projects, track tasks with
            subtasks, and maintain team notes with secure role-based access.
          </p>

          <Link
            to="/register"
            className="w-full sm:w-auto bg-indigo-600 text-white px-8 md:px-10 py-3.5 md:py-4 rounded-2xl text-base md:text-lg font-black shadow-2xl shadow-indigo-900/50 hover:bg-indigo-500 transition-all inline-block"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="pb-32 px-6 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {[
          {
            title: "Task Lifecycle",
            desc: "Track tasks from Todo to Done with granular control.",
          },
          {
            title: "Team Roles",
            desc: "Admins or Members - everyone has the right permissions.",
          },
          {
            title: "Subtasks",
            desc: "Break big projects into small, manageable steps.",
          },
        ].map((feat, i) => (
          <div
            key={i}
            className="p-8 md:p-12 bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] border border-gray-800 transition-all hover:border-indigo-500/50 group"
          >
            <div className="text-indigo-500 font-black mb-4 md:mb-6 text-lg md:text-xl">
              0{i + 1}.
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">
              {feat.title}
            </h3>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-medium">
              {feat.desc}
            </p>
          </div>
        ))}
      </section>
      <footer className="mt-auto py-8 text-center  bg-gray-950 z-10">
        <p className="text-gray-500 text-xs md:text-sm font-medium">
          © {new Date().getFullYear()} Project Camp. Built by{" "}
          <a
            href="https://www.wasi.live/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-500 hover:text-indigo-400 transition-colors font-bold underline decoration-indigo-500/30 underline-offset-4 hover:decoration-indigo-400"
          >
            Wasi.
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
