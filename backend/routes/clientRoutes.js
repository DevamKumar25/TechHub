import express from "express";

import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getClients,
  getClientStats,
  getClientsForDropdown,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} from "../controllers/clientController.js";

const router = express.Router();

router.use(verifyToken);

// Static sub-routes MUST come before "/:id" or Express will treat them as an id
router.get("/stats", getClientStats);
router.get("/dropdown", getClientsForDropdown);

router.route("/").get(getClients).post(createClient);
router.route("/:id").get(getClientById).put(updateClient).delete(deleteClient);

export default router;