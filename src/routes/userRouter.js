const express = require("express");
const router = express.Router();

const User = require("../model/user");
const Appointment = require("../model/appointment");
const Applicant = require("../model/applicant");
const UserAppointment = require("../model/userAppointment");

const { isAuthenticated, requireAdmin } = require("../controllers/auth");

router.get("/", isAuthenticated, function (req, res) {
  res.status(200).json(req.user);
});

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

    const userCreatedAppointments = await Appointment.find({
      ...queryObject,
      createdBy: userId,
      isDeleted: { $ne: true },
    })
      .select("-__v -updatedAt -isDeleted")
      .lean();

    const userAppointments = await UserAppointment.find({ user: userId });
    const appointmentIds = userAppointments.map((ua) => ua.appointment);

    const userAssignedAppointments = await Appointment.find({
      ...queryObject,
      _id: { $in: appointmentIds },
      isDeleted: { $ne: true },
    })
      .select("-__v -updatedAt -isDeleted")
      .lean();

    const assignedAppointments = await Promise.all(
      userAssignedAppointments.map(async (appointment) => {
        const applicants = await Applicant.find({
          appointment: appointment._id,
          isDeleted: { $ne: true },
        })
          .select("-__v -updatedAt -createdAt -isDeleted -appointment")
          .lean();

        return {
          ...appointment,
          applicants,
          numberOfApplicants: applicants.length,
        };
      })
    );

    const createdAppointments = await Promise.all(
      userCreatedAppointments.map(async (appointment) => {
        const applicants = await Applicant.find({
          appointment: appointment._id,
          isDeleted: { $ne: true },
        })
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

// get all assigned users
router.get(
  "/users/assign",
  isAuthenticated,
  requireAdmin,
  async (req, res, next) => {
    try {
      const user_appointments = await UserAppointment.find();
      res.json(user_appointments);
    } catch (err) {
      next(err);
    }
  }
);

// assigning/de-assigning appointments to user routes
router.get(
  "/users/assign/:userId/:appointmentId",
  isAuthenticated,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { userId, appointmentId } = req.params;

      const user_appointment = await UserAppointment.create({
        user: userId,
        appointment: appointmentId,
      });

      if (user_appointment) {
        console.log("created");
      }

      res.json(user_appointment);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/users/assign/:userId/:appointmentId",
  isAuthenticated,
  requireAdmin,
  async (req, res, next) => {
    try {
      const { userId, appointmentId } = req.params;

      const result = await UserAppointment.deleteMany({
        user: userId,
        appointment: appointmentId,
      });

      if (result.deletedCount === 0) {
        const result2 = await Appointment.findByIdAndUpdate(appointmentId, {
          createdBy: null,
        });

        return res.json(result2);
      }

      console.log(result);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/users", isAuthenticated, requireAdmin, async (req, res, next) => {
  const users = await User.find().select("_id email role");

  res.json(users);
});

module.exports = router;
