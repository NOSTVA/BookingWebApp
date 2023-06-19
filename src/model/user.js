const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const structure = {
  password: {
    type: String,
    required: [true, "The password field is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  email: {
    type: String,
    required: [true, "The Email field is required"],
    unique: true,
    lowercase: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Invalid email",
    ],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
};

const options = {
  timestamps: true,
};

const userSchema = new mongoose.Schema(structure, options);

userSchema.plugin(uniqueValidator, {
  message: "{PATH} already exists.",
});

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (canditatePassword) {
  return (isMatch = await bcrypt.compare(canditatePassword, this.password));
};

module.exports = mongoose.model("User", userSchema);
