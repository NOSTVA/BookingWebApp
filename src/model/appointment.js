const mongoose = require("mongoose");
const Attributes = require("./attributes");
const uniqueValidator = require("mongoose-unique-validator");

const appointmentSchema = new mongoose.Schema(
  {
    expectedTravelDate: {
      type: Date,
      required: [true, "The expected travel date field is required"],
    },
    email: {
      type: String,
      required: [true, "The Email field is required"],
      trim: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Ivalid email address",
      ],
    },
    phone: {
      type: String,
      required: [true, "The Phone number filed is required"],
      trim: true,
      match: [/^\+20\d{11}$/, "Invalid Phone Number"],
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      default: "pending",
      enum: Attributes.statusEnums,
      index: true,
    },
    owner: {
      type: String,
      default: "none",
      enum: Attributes.ownerEnums,
      index: true,
    },
    visa: {
      type: String,
      default: "none",
      enum: Attributes.visaEnums,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.plugin(uniqueValidator, {
  message: "{PATH} already exists.",
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
