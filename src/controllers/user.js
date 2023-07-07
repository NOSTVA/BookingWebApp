const User = require("../model/user");
const Appointment = require("../model/appointment");
const passport = require("passport");

exports.get_users = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, user: users });
  } catch (error) {
    res.status(404).send({ success: false, message: error });
  }
};

exports.get_user = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user != null) {
      res.json({ success: false, user: user });
    } else {
      res.json({ success: true, user: user });
    }
  } catch (error) {
    res.status(404).send({ success: false, message: error });
  }
};

exports.register_user = async function (req, res) {
  let newUser = new User();

  newUser.email = req.body.email;
  newUser.password = req.body.password;
  newUser.role = "user";

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).json({
      success: false,
      message: "user with " + req.body.email + " exists",
    });
  } else {
    newUser
      .save()
      .then((savedUser) => {
        req.login(savedUser, { session: true }, (error) => {
          if (error) return next(error);
          return res.status(200).json({
            success: true,
            user: savedUser,
          });
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: "Failed to add user. " + err,
        });
      });
  }
};

exports.login_user = async (req, res, next) => {
  try {
    passport.authenticate("local", (error, user, info) => {
      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

      if (!user) {
        return res.status(400).json({
          success: false,
          error: "User not found.",
        });
      }

      req.login(user, { session: true }, (error) => {
        if (error) {
          return next(error);
        }
        return res.status(200).json({
          success: true,
          user,
        });
      });
    })(req, res, next);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.logout_user = async (req, res, next) => {
  try {
    req.logout((error) => {
      if (error) {
        return next(error);
      }
      return res.status(200).json({ success: true, user: req.user });
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.assign_appointment_to_user = async (req, res, next) => {
  try {
    const { userId, appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    const { assignedUsers } = appointment;

    if (assignedUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "User already assigned to appointment.",
      });
    }

    assignedUsers.push(userId);
    await appointment.save();

    return res.json({
      success: true,
      message: "User successfully assigned to appointment.",
    });
  } catch (err) {
    next(err);
  }
};

exports.deassign_appointment_from_user = async (req, res, next) => {
  try {
    const { userId, appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    const updatedAssignedUsers = appointment.assignedUsers.filter(
      (assignedUserId) =>
        JSON.stringify(assignedUserId) !== JSON.stringify(userId)
    );

    if (updatedAssignedUsers.length === appointment.assignedUsers.length) {
      return res.status(400).json({
        success: false,
        message: "User is not assigned to this appointment.",
      });
    }

    await Appointment.findByIdAndUpdate(appointmentId, {
      assignedUsers: updatedAssignedUsers,
    });

    return res.json({
      success: true,
      message: "User successfully unassigned from appointment.",
    });
  } catch (err) {
    next(err);
  }
};
