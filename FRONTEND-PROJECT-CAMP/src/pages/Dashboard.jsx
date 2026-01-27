import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const { user, logout } = useAuth();
  // useTheme removed - Permanent Dark Mode
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/projects");
      setProjects(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) logout();
      else toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/projects", formData);
      setProjects([response.data.data, ...projects]);
      setFormData({ name: "", description: "" });
      setIsModalOpen(false);
      toast.success("Camp created!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create");
    }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this camp and all its contents?")) return;
    try {
      await api.delete(`/projects/${projectId}`);
      setProjects(projects.filter((p) => p._id !== projectId));
      toast.success("Camp deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    // Fixed Background: Permanent Dark (Gray 950)
    <div className="min-h-screen p-4 sm:p-6 md:p-12 bg-gray-950 text-white transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white capitalize">
              {user?.username?.split(" ")[0]}'s{" "}
              <span className="text-indigo-500">Camp.</span>
            </h1>
            <p className="text-sm md:text-base text-gray-400 font-medium mt-1 md:mt-2">
              Manage your workspace and team projects.
            </p>
          </motion.div>

          {/* Identity Capsule - Dark Themed */}
          <div className="flex flex-wrap items-center gap-3 md:gap-4 bg-gray-900 p-2 pr-4 md:pr-6 rounded-2xl border border-gray-800 shadow-sm transition-all w-full md:w-auto">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg text-sm md:text-base">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="leading-none">
                <p className="text-[8px] md:text-[9px] font-black text-gray-500 uppercase tracking-widest mb-0.5 md:mb-1">
                  Authenticated
                </p>
                <p className="text-xs md:text-sm font-bold text-white truncate max-w-25 sm:max-w-none">
                  {user?.username}
                </p>
              </div>
            </div>

            <div className="h-6 md:h-8 w-px bg-gray-800 mx-1" />

            <div className="flex items-center gap-2 md:gap-3 ml-auto md:ml-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 text-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl font-bold hover:bg-indigo-500 transition text-xs md:text-sm"
              >
                + New
              </button>
              <button
                onClick={logout}
                className="text-red-400 font-bold text-[10px] md:text-xs uppercase tracking-widest hover:text-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* PROJECTS GRID */}
        <h2 className="text-[10px] font-black mb-6 md:mb-8 text-gray-500 uppercase tracking-[0.3em]">
          Active Workspaces
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence>
              {projects.map((project) => {
                const projectAdminId = project.admin?._id || project.admin;
                const currentUserId = user?._id;
                const isOwner =
                  projectAdminId?.toString() === currentUserId?.toString();

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={project._id}
                    onClick={() => navigate(`/project/${project._id}`)}
                    className="group relative p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] border border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-indigo-500 transition-all cursor-pointer h-56 md:h-64 flex flex-col shadow-sm"
                  >
                    {isOwner && (
                      <button
                        onClick={(e) => handleDeleteProject(e, project._id)}
                        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-gray-500 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        ✕
                      </button>
                    )}

                    <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-white group-hover:text-indigo-400 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-400 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-auto pt-4 md:pt-6 flex justify-between items-center border-t border-gray-800">
                      <span
                        className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${isOwner ? "text-indigo-400" : "text-emerald-400"}`}
                      >
                        {isOwner ? "Admin" : "Member"}
                      </span>
                      <span className="text-[10px] md:text-xs font-bold text-indigo-400 md:opacity-0 group-hover:opacity-100 transition-all">
                        Open Board →
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {projects.length === 0 && (
              <div
                onClick={() => setIsModalOpen(true)}
                className="border-2 border-dashed border-gray-800 rounded-4xl md:rounded-[2.5rem] flex flex-col items-center justify-center h-56 md:h-64 hover:border-indigo-500/50 hover:bg-gray-900/30 transition-all cursor-pointer group"
              >
                <span className="text-3xl md:text-4xl mb-3 md:mb-4 opacity-20 group-hover:opacity-40 transition-opacity grayscale">
                  📁
                </span>
                <p className="text-sm md:text-base text-gray-500 font-bold group-hover:text-gray-300 transition-colors">
                  Create your first camp
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* CREATE MODAL - Dark Theme */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 100 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 100 }}
              className="bg-gray-900 rounded-t-4xl sm:rounded-[3rem] p-6 md:p-10 max-w-md w-full border border-gray-800 shadow-2xl"
            >
              <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 tracking-tight text-white">
                New Camp.
              </h2>
              <form
                onSubmit={handleCreateProject}
                className="space-y-4 md:space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2">
                    Camp Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 md:p-4 bg-gray-800 text-white border border-gray-700 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows="3"
                    className="w-full p-3 md:p-4 bg-gray-800 text-white border border-gray-700 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm focus:border-transparent transition-all"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 md:py-4 font-bold text-gray-500 text-sm hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black shadow-lg hover:bg-indigo-500 transition text-sm"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
