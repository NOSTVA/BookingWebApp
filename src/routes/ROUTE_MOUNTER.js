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

app.use((req, res, next) => {
  if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
    next();
  } else {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    res.sendFile(path.join(__dirname, "../public/index.html"));
  }
});
app.use(express.static(path.join(__dirname, "../public")));
