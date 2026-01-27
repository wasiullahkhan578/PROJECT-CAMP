import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  // Removed useTheme hook
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState({ title: "", description: "" });
  const [memberEmail, setMemberEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const isAdmin = project?.admin?.toString() === user?._id?.toString();

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${projectId}`);
      setProject(response.data.data);
      setTasks(response.data.data.tasks || []);
      setNotes(response.data.data.notes || "");
    } catch (error) {
      toast.error("Failed to load project");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const handleAddSubtask = async (taskId, title) => {
    if (!title.trim()) return;
    try {
      const response = await api.post(`/tasks/${taskId}/subtask`, { title });
      setTasks(tasks.map((t) => (t._id === taskId ? response.data.data : t)));
    } catch (error) {
      toast.error("Failed to add subtask");
    }
  };

  const handleToggleSubtask = async (taskId, subtaskId) => {
    try {
      const response = await api.patch(`/tasks/${taskId}/subtask/${subtaskId}`);
      setTasks(tasks.map((t) => (t._id === taskId ? response.data.data : t)));
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    try {
      const response = await api.post(`/projects/${projectId}/add-member`, {
        email: memberEmail,
      });
      setProject({
        ...project,
        members: [...(project.members || []), response.data.data],
      });
      setMemberEmail("");
      toast.success("Member added!");
    } catch (error) {
      toast.error("User not found");
    } finally {
      setIsInviting(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      await api.patch(`/projects/${projectId}/notes`, { notes });
      toast.success("Saved!");
      setIsEditingNotes(false);
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/tasks", { ...taskData, projectId });
      setTasks([...tasks, response.data.data]);
      setIsModalOpen(false);
      setTaskData({ title: "", description: "" });
      toast.success("Task created!");
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, {
        status: newStatus,
      });
      setTasks(tasks.map((t) => (t._id === taskId ? response.data.data : t)));
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!isAdmin) return toast.error("Admin only");
    if (!window.confirm("Delete task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t._id !== taskId));
      toast.success("Deleted");
    } catch (error) {
      toast.error("Failed");
    }
  };

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white font-bold animate-pulse">
        Loading Board...
      </div>
    );

  return (
    // Fixed Background: Permanent Dark (Gray 950)
    <div className="min-h-screen p-4 sm:p-6 md:p-12 bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <button
              onClick={() => navigate("/dashboard")}
              className="text-indigo-400 font-bold mb-2 flex items-center gap-1 hover:-translate-x-1 transition-transform text-sm"
            >
              ← Board
            </button>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              {project?.name}
            </h1>
          </motion.div>

          <div className="flex flex-wrap items-center gap-3 bg-gray-900 p-2 pr-4 md:pr-6 rounded-2xl border border-gray-800 shadow-sm w-full md:w-auto">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">
                  Authenticated
                </p>
                <p className="text-sm font-bold text-white">{user?.username}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-800 mx-1 md:mx-2" />
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none bg-indigo-600 text-white px-4 md:px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-500 transition text-sm whitespace-nowrap"
            >
              + New Task
            </button>
          </div>
        </div>

        {/* TEAM SECTION */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gray-900 p-6 md:p-8 rounded-4xl md:rounded-[2.5rem] border border-gray-800 mb-8 md:mb-12 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div className="w-full">
              <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                Team Space
              </h2>
              <div className="flex flex-wrap gap-3 md:gap-4">
                {project?.members?.map((member) => (
                  <div
                    key={member._id}
                    className="flex items-center gap-2 md:gap-3 bg-gray-800 p-1.5 md:p-2 pr-3 md:pr-4 rounded-xl border border-gray-700"
                  >
                    <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] md:text-xs font-bold">
                      {member.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] md:text-xs font-bold text-white">
                        {member.username}
                      </span>
                      <span
                        className={`text-[8px] font-black uppercase ${member._id === project?.admin ? "text-indigo-400" : "text-emerald-400"}`}
                      >
                        {member._id === project?.admin ? "Admin" : "Member"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {isAdmin && (
              <div className="w-full lg:w-auto lg:border-l border-gray-800 lg:pl-8">
                <form onSubmit={handleAddMember} className="flex gap-2 w-full">
                  <input
                    type="email"
                    placeholder="Invite by adding email..."
                    className="flex-1 lg:w-48 bg-gray-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-white border border-gray-700 focus:border-transparent"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    required
                  />
                  <button className="bg-white text-black px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap hover:bg-gray-200">
                    {isInviting ? "..." : "Add"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </motion.div>

        {/* KANBAN BOARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
            <div
              key={status}
              className="bg-gray-900/50 p-4 md:p-6 rounded-4xl md:rounded-4xl border border-gray-800 min-h-55"
            >
              <h2 className="font-black text-gray-500 mb-6 flex justify-between items-center text-[10px] tracking-widest uppercase">
                {status.replace("_", " ")}
                <span className="bg-gray-800 px-2 py-1 rounded-md border border-gray-700 text-white">
                  {getTasksByStatus(status).length}
                </span>
              </h2>

              <div className="space-y-4">
                <AnimatePresence>
                  {getTasksByStatus(status).map((task) => (
                    <motion.div
                      layout
                      key={task._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-gray-900 p-5 md:p-6 rounded-2xl border border-gray-800 shadow-sm group hover:border-gray-700 transition-all"
                    >
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h3 className="font-bold text-sm text-white">
                          {task.title}
                        </h3>
                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-gray-500 hover:text-red-500 md:opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        {task.subtasks?.map((sub) => (
                          <div
                            key={sub._id}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={sub.isCompleted}
                              onChange={() =>
                                handleToggleSubtask(task._id, sub._id)
                              }
                              className="w-3.5 h-3.5 rounded bg-gray-800 border-gray-600 text-indigo-600 focus:ring-0 checked:bg-indigo-600"
                            />
                            <span
                              className={`text-[11px] ${sub.isCompleted ? "line-through text-gray-500" : "font-medium text-gray-300"}`}
                            >
                              {sub.title}
                            </span>
                          </div>
                        ))}
                        <input
                          type="text"
                          placeholder="+ Add step..."
                          className="w-full text-[10px] bg-transparent border-b border-gray-800 focus:border-indigo-500 outline-none py-1 text-gray-400 focus:text-white transition-colors"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleAddSubtask(task._id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />
                      </div>

                      <select
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task._id, e.target.value)
                        }
                        className="w-full text-[10px] font-black bg-gray-800 text-white rounded-lg p-2.5 outline-none cursor-pointer appearance-none border border-transparent focus:border-indigo-500"
                      >
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                      </select>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>

        {/* DOCUMENTATION */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 md:mt-16 bg-gray-900 rounded-4xl md:rounded-[2.5rem] border border-gray-800 p-6 md:p-10 mb-20 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
            <h2 className="text-xl md:text-2xl font-black text-white">
              Documentation.
            </h2>
            <button
              onClick={() =>
                isEditingNotes ? handleSaveNotes() : setIsEditingNotes(true)
              }
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm transition ${isEditingNotes ? "bg-emerald-600 text-white" : "bg-gray-800 text-white hover:bg-gray-700"}`}
            >
              {isSavingNotes ? "Saving..." : isEditingNotes ? "Save" : "Edit"}
            </button>
          </div>
          {isEditingNotes ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-64 md:h-80 p-4 md:p-6 bg-gray-950 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs md:text-sm leading-relaxed text-white border border-gray-800"
              placeholder="Write your project notes here..."
            />
          ) : (
            <div className="bg-gray-950/50 p-6 md:p-8 rounded-2xl border border-dashed border-gray-800">
              <pre className="whitespace-pre-wrap font-sans text-gray-400 leading-relaxed text-xs md:text-sm">
                {notes || "No documentation yet."}
              </pre>
            </div>
          )}
        </motion.div>
      </div>

      {/* TASK MODAL */}
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
                New Task.
              </h2>
              <form
                onSubmit={handleCreateTask}
                className="space-y-4 md:space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-4 bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-white border border-gray-700 focus:border-transparent"
                    value={taskData.title}
                    onChange={(e) =>
                      setTaskData({ ...taskData, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full p-4 bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-white border border-gray-700 focus:border-transparent"
                    rows="3"
                    value={taskData.description}
                    onChange={(e) =>
                      setTaskData({ ...taskData, description: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-3 md:gap-4 pt-4 pb-4 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-4 font-bold text-gray-500 text-sm hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-indigo-500 transition text-sm"
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

export default ProjectDetails;
