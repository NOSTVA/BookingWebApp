require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bodyParser = require("body-parser");

const app = express();
const SessionStore = MongoStore.create({ mongoUrl: process.env.MONGODB_URI });

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: SessionStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
  })
);

require("./passport-config");
app.use(passport.initialize());
app.use(passport.session());

app.use(require("../routes/ROUTE_MOUNTER"));

app.use(function (err, req, res, next) {
  console.log(err);

  if (err.code === 11000) {
    return res
      .status(400)
      .json({ message: "Duplicate key error", err: err.message });
  }
  res.status(err.status || 500);
});

module.exports = app;
