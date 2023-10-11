const express = require("express");
const router = express.Router();

const appointmentController = require("../controllers/appointment");

router.get("/extension", appointmentController.get_extension_appointments);
router.get("/", appointmentController.get_appointments);
router.get("/:id", appointmentController.get_appointment);
router.post("/", appointmentController.create_appointment);
router.delete("/:id", appointmentController.delete_appointment);
router.patch("/:id", appointmentController.update_appointment);

module.exports = router;
