const express = require("express");
const router = express.Router();

const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  deleteAppointmentById,
  updateAppointmentById,
} = require("../controllers/controller");

const { isAuthenticated, requireAdmin } = require("../controllers/auth");

router.get("/:id", isAuthenticated, getAppointmentById);
router.post("/", isAuthenticated, createAppointment);

router.get("/", isAuthenticated, getAppointments);
router.delete("/:id", isAuthenticated, requireAdmin, deleteAppointmentById);
router.patch("/:id", isAuthenticated, requireAdmin, updateAppointmentById);

module.exports = router;
