const mongoose = require("mongoose");
const attributes = require("./attributes");

const applicant = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Types.ObjectId,
      ref: "Appointment",
      required: true,
      index: true,
    },
    index: {
      type: Number,
      default: 0,
    },
    firstName: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    passportNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 10,
    },
    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          const now = new Date();
          return value < now;
        },
        message: "Invalid date of birth",
      },
    },
    image: {
      type: String,
      match: attributes.urlRegex,
      default: "https://example.com",
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

const Applicant = mongoose.model("Applicant", applicant);
module.exports = Applicant;
