const mongoose = require("mongoose");

const structure = {
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "The user field is required"],
    index: true,
  },
  appointment: {
    type: mongoose.Types.ObjectId,
    ref: "Appointment",
    required: [true, "The appointment field is required"],
    index: true,
  },
};

const options = {
  timestamps: true,
};

const userAppointmentSchema = new mongoose.Schema(structure, options);

const UserAppointment = mongoose.model(
  "UserAppointment",
  userAppointmentSchema
);
module.exports = UserAppointment;
