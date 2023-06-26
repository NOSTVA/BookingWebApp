const express = require("express");
const router = express.Router();
const path = require("path");

const {
  requireAdmin,
  isNotAuthenticated,
  isAuthenticated,
} = require("../controllers/auth");

router.get("/app/booking/team/signup", isNotAuthenticated, function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get("/login", isNotAuthenticated, function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get("/", isAuthenticated, (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
router.get("/create", isAuthenticated, (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get("/myappointments", isAuthenticated, (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

router.get("/admin", isAuthenticated, requireAdmin, (req, res, next) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = router;
