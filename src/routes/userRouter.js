const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/", userController.get_users);
router.post(
  "/assign/:userId/:appointmentId",
  userController.assign_appointment_to_user
);
router.delete(
  "/assign/:userId/:appointmentId",
  userController.deassign_appointment_from_user
);

module.exports = router;
