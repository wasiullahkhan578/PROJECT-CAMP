import { Project } from "../models/project.models.js";
import { Task } from "../models/task.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { User } from "../models/user.models.js";

// 1. Create a new project
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Project name and description are required");
  }

  const project = await Project.create({
    name,
    description,
    admin: req.user._id,
    members: [req.user._id], // Admin automatically member list mein jayega
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project created successfully"));
});

// 2. Get all projects (Where user is Admin OR Member)
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ admin: req.user._id }, { members: req.user._id }],
  })
    .sort("-createdAt")
    .populate("admin", "username email"); // Admin ki details bhi laayein

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

// 3. Get Project Details (Populated)
const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId)
    .populate("tasks")
    .populate("members", "username email");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, project, "Project details fetched successfully"),
    );
});

// 4. Delete Project (Only Admin Authority)
const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // AUTHORITY CHECK: Sirf Admin delete kar sakta hai
  if (project.admin.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "Authority Denied: Only Admin can delete the project",
    );
  }

  // 1. Delete associated tasks
  await Task.deleteMany({ project: projectId });

  // 2. Delete project
  await project.deleteOne();

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Project and its tasks deleted successfully"),
    );
});

// 5. Update Project Details (Only Admin Authority)
const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description } = req.body;

  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // AUTHORITY CHECK: Sirf Admin edit kar sakta hai
  if (project.admin.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "Authority Denied: Only Admin can update project details",
    );
  }

  project.name = name || project.name;
  project.description = description || project.description;
  await project.save();

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project updated successfully"));
});

// 6. Add Member (Only Admin Authority)
const addMemberToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { email } = req.body;

  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found");

  // AUTHORITY CHECK: Sirf Admin invite kar sakta hai
  if (project.admin.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Authority Denied: Only Admin can invite members");
  }

  const userToAdd = await User.findOne({ email: email.toLowerCase() });
  if (!userToAdd) throw new ApiError(404, "User not found");

  if (project.members.includes(userToAdd._id)) {
    throw new ApiError(400, "User is already a member of this project");
  }

  project.members.push(userToAdd._id);
  await project.save();

  // Return populated user data taaki frontend turant avatar dikha sake
  const memberData = {
    _id: userToAdd._id,
    username: userToAdd.username,
    email: userToAdd.email,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, memberData, "Member added successfully"));
});

const updateProjectNotes = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { notes } = req.body;

  // Project find karein aur notes update karein
  const project = await Project.findByIdAndUpdate(
    projectId,
    { $set: { notes } },
    { new: true },
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project.notes, "Notes updated successfully"));
});

export {
  createProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  updateProject,
  addMemberToProject,
  updateProjectNotes,
};
