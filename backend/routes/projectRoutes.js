import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getProjects,
  getProjectStats,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
} from "../controllers/projectController.js";

const router = express.Router();

router.use(verifyToken);

// Static sub-route before "/:id"
router.get("/stats", getProjectStats);

router.route("/").get(getProjects).post(createProject);
router.route("/:id").get(getProjectById).put(updateProject).delete(deleteProject);

router.post("/:id/team", addTeamMember);
router.delete("/:id/team/:employeeId", removeTeamMember);

export default router;