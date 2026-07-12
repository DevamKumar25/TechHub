import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getEmployees,
  getEmployeesForDropdown,
  exportEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();

router.use(verifyToken);

// Static sub-routes before "/:id"
router.get("/dropdown", getEmployeesForDropdown);
router.get("/export", exportEmployees);

router.route("/").get(getEmployees).post(createEmployee);
router.route("/:id").get(getEmployeeById).put(updateEmployee).delete(deleteEmployee);

export default router;