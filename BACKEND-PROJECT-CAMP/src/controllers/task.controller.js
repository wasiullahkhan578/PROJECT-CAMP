import { Task } from "../models/task.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { Project } from "../models/project.models.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId } = req.body;

  if (!title || !projectId) {
    throw new ApiError(400, "Title and Project ID are required");
  }

  const task = await Task.create({
    title,
    description,
    project: projectId,
  });

  await Project.findByIdAndUpdate(
    projectId,
    { $push: { tasks: task._id } }, // Pushes the new task ID into the project's tasks array
  );

  return res
    .status(201)
    .json(new ApiResponse(201, task, "Task added successfully"));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  // Validate that the status is one of our allowed values
  if (!["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const task = await Task.findByIdAndUpdate(
    taskId,
    { $set: { status } },
    { new: true }, // Returns the updated document
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task status updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // 1. Remove the task ID from the associated Project
  await Project.findByIdAndUpdate(task.project, { $pull: { tasks: taskId } });

  // 2. Delete the task itself
  await task.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

const addSubtask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { title } = req.body;

  if (!title) {
    throw new ApiError(400, "Subtask title is required");
  }

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Subtask ko array mein add karein
  task.subtasks.push({ title });
  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Subtask added successfully"));
});

const toggleSubtask = asyncHandler(async (req, res) => {
  const { taskId, subtaskId } = req.params;

  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Mongoose magic: array mein se subtask dhoondein
  const subtask = task.subtasks.id(subtaskId);

  if (!subtask) {
    throw new ApiError(404, "Subtask not found");
  }

  // Status ko ulat dein (true -> false, false -> true)
  subtask.isCompleted = !subtask.isCompleted;
  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Subtask status toggled"));
});

export { createTask, updateTaskStatus, deleteTask, addSubtask, toggleSubtask };
