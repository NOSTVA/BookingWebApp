const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const applicantSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Types.ObjectId,
      ref: "Appointment",
      required: [true, "The appointment field is required"],
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "The first name field is required"],
      minlength: [1, "First name too short"],
      maxlength: [50, "First name too long"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "The last name field is required"],
      minlength: [2, "Last name too short"],
      maxlength: [50, "Last name too long"],
      trim: true,
    },
    passportNumber: {
      type: String,
      required: [true, "The passport field is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "The date of birth field is required"],
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
      required: [true, "An image URL is required"],
      match: [/^https?:\/\/\S+\.\S+$/, "Invalid image URL"],
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
applicantSchema.plugin(uniqueValidator, {
  message: "{PATH} already exists.",
});

const Applicant = mongoose.model("Applicant", applicantSchema);

module.exports = Applicant;
