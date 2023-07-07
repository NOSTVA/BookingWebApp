const path = require("path");
const express = require("express");
module.exports = app = express();

const { isAuthenticated, requireAdmin } = require("../controllers/auth");

const authRouter = require("../routes/authRouter");
const userRouter = require("../routes/userRouter");
const appointmentsRouter = require("../routes/appointmentsRouter");
const applicantsRouter = require("../routes/applicantsRouter");

app.use("/api/v2", authRouter);
app.use("/api/v2/users", isAuthenticated, requireAdmin, userRouter);
app.use("/api/v2/appointments", isAuthenticated, appointmentsRouter);
app.use("/api/v2/applicants", isAuthenticated, applicantsRouter);

app.use(express.static(path.join(__dirname, "../public")));
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get("/create", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.get("/team/auth/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
