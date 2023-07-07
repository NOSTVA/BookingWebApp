const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const attributes = require("./attributes");

const user = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: attributes.emailRegex,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
  },
  { timestamps: true, autoCreate: true, autoIndex: true }
);

user.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

user.methods.validPassword = async function (canditatePassword) {
  return (isMatch = await bcrypt.compare(canditatePassword, this.password));
};

const User = mongoose.model("User", user);
module.exports = User;
