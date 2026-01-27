import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMemberToProject,
  updateProjectNotes,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply verifyJWT to all routes in this file
router.use(verifyJWT);

router.route("/").post(createProject).get(getAllProjects);
router.route("/:projectId").get(getProjectById);
router
  .route("/:projectId")
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

router.route("/:projectId/add-member").post(addMemberToProject);
router.route("/:projectId/notes").patch(updateProjectNotes);

export default router;
