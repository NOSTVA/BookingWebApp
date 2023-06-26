const passport = require("passport");
const express = require("express");
const router = express.Router();
const User = require("../model/user");
const path = require("path");

const { isAuthenticated, isNotAuthenticated } = require("../controllers/auth");

// authentication api
router.post("/login", isNotAuthenticated, (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.login(user, { session: true }, (error) => {
      if (error) {
        return next(error);
      }

      if (user.role === "admin") return res.redirect("/admin");
      if (user.role === "user") return res.redirect("/myappointments");
    });
  })(req, res, next);
});

router.post("/register", isNotAuthenticated, async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await User.create({ password, email });
    if (user) {
      req.login(user, { session: true }, (error) => {
        if (error) {
          return next(error);
        }
        if (user.role === "admin") return res.redirect("/admin");
        if (user.role === "user") return res.redirect("/myappointments");
      });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/logout", isAuthenticated, (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/login");
  });
});

module.exports = router;
