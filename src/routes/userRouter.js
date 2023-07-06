const express = require("express");
const router = express.Router();

const User = require("../model/user");
const Appointment = require("../model/appointment");
const Applicant = require("../model/applicant");

const { isAuthenticated, requireAdmin } = require("../controllers/auth");

router.get("/", isAuthenticated, function (req, res) {
  res.status(200).json(req.user);
});

router.get("/users", isAuthenticated, requireAdmin, async (req, res, next) => {
  const users = await User.find().select("_id email role");
  res.json(users);
});

// assigning appointments to user routes
router.post(
  "/users/assign/:userId/:appointmentId",
  isAuthenticated,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { userId, appointmentId } = req.params;

      const appointment = await Appointment.findById(appointmentId);
      const isAssigned = appointment.assignedUsers.includes(userId);

      if (!isAssigned) {
        appointment.assignedUsers.push(userId);
        await appointment.save();
        return res
          .status(200)
          .json({ message: "User successfully assigned to appointment." });
      }

      return res
        .status(400)
        .json({ message: "User already assigned to appointment." });
    } catch (err) {
      next(err);
    }
  }
);

// de-assigning appointments to user routes
router.delete(
  "/users/assign/:userId/:appointmentId",
  isAuthenticated,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { userId, appointmentId } = req.params;

      const appointment = await Appointment.findById(appointmentId);
      const updatedAssignedUsers = appointment.assignedUsers.filter(
        (assignedUserId) =>
          JSON.stringify(assignedUserId) !== JSON.stringify(userId)
      );

      if (updatedAssignedUsers.length === appointment.assignedUsers.length) {
        return res
          .status(400)
          .json({ message: "User is not assigned to this appointment." });
      }

      await Appointment.findByIdAndUpdate(appointmentId, {
        assignedUsers: updatedAssignedUsers,
      });

      return res
        .status(200)
        .json({ message: "User successfully unassigned from appointment." });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/appointments", isAuthenticated, async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const { visa, status, owner } = req.query;

    const queryObject = {};

    if (visa) {
      queryObject.visa = visa;
    }
    if (status) {
      queryObject.status = status;
    }
    if (owner) {
      queryObject.owner = owner;
    }

    const userAssignedAppointments = await Appointment.find({
      ...queryObject,
      isDeleted: { $ne: true },
      assignedUsers: { $in: [userId] },
    })
      .select("-__v -updatedAt -isDeleted")
      .lean();

    const assignedAppointments = await Promise.all(
      userAssignedAppointments.map(async (appointment) => {
        const applicants = await Applicant.find({
          appointment: appointment._id,
          isDeleted: { $ne: true },
        })
          .sort("-createdAt")
          .select("-__v -updatedAt -createdAt -isDeleted -appointment")
          .lean();

        return {
          ...appointment,
          applicants,
          numberOfApplicants: applicants.length,
        };
      })
    );

    const userCreatedAppointments = await Appointment.find({
      ...queryObject,
      createdBy: userId,
      isDeleted: { $ne: true },
    })
      .select("-__v -updatedAt -isDeleted")
      .lean();

    const createdAppointments = await Promise.all(
      userCreatedAppointments.map(async (appointment) => {
        const applicants = await Applicant.find({
          appointment: appointment._id,
          isDeleted: { $ne: true },
        })
          .sort("createdAt")
          .select("-__v -updatedAt -createdAt -isDeleted -appointment")
          .lean();
        return {
          ...appointment,
          applicants,
          numberOfApplicants: applicants.length,
        };
      })
    );

    const ownerEmuns = await Appointment.schema.path("owner").options.enum;
    const visaEmuns = await Appointment.schema.path("visa").options.enum;
    const statusEmuns = await Appointment.schema.path("status").options.enum;

    res.json({
      payload: {
        assignedAppointments,
        createdAppointments,
      },
      attributes: { ownerEmuns, visaEmuns, statusEmuns },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
