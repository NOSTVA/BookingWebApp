const mongoose = require("mongoose");
const attributes = require("./attributes");

const appointment = new mongoose.Schema(
  {
    expectedTravelDate: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: attributes.emailRegex,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: attributes.phoneRegex,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      default: "pending",
      enum: attributes.statusEnums,
      index: true,
    },
    owner: {
      type: String,
      default: "none",
      enum: attributes.ownerEnums,
      index: true,
    },
    visa: {
      type: String,
      default: "none",
      enum: attributes.visaEnums,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    assignedUsers: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
      ],
      default: () => new Array(),
    },
  },
  { timestamps: true, autoCreate: true }
);

const Appointment = mongoose.model("Appointment", appointment);
module.exports = Appointment;
