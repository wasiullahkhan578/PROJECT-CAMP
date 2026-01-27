import { Router } from "express";
import {
  createTask,
  updateTaskStatus,
  deleteTask,
  addSubtask, 
  toggleSubtask,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").post(createTask);
router.route("/:taskId").patch(updateTaskStatus);
router.route("/:taskId").patch(updateTaskStatus).delete(deleteTask);
router.route("/:taskId/subtask").post(addSubtask);
router.route("/:taskId/subtask/:subtaskId").patch(toggleSubtask);

export default router;
