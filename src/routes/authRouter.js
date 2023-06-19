const passport = require("passport");
const express = require("express");
const router = express.Router();
const User = require("../model/user");
const path = require("path");

const { isAuthenticated, isNotAuthenticated } = require("../controllers/auth");

router.get("/register", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

router.get("/login", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/login.html"));
});

// authentication api
router.post("/login", (req, res) => {
  res.sendFile("ASdasdasd");
});

router.post("/register", async (req, res, next) => {
  res.sendFile("ASdasdasd");
  // try {
  //   const { password, email } = req.body;
  //   await User.create({ password, email });
  //   res.redirect("/login");
  // } catch (error) {
  //   console.log(error);
  //   res.redirect("/register");
  // }
});

router.get("/logout", isAuthenticated, (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/login");
  });
});

router.get("/u", isAuthenticated, function (req, res) {
  res.status(200).json(req.user);
});

router.use(isAuthenticated, (req, res, next) => {
  next();
});

module.exports = router;
