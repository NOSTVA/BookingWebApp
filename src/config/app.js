require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("express-flash");
const bodyParser = require("body-parser");

const appointmentsRouter = require("../routes/appointmentsRouter");
const applicantsRouter = require("../routes/applicantsRouter");
const authRouter = require("../routes/authRouter");
const clientRouter = require("../routes/clientRouter");

const errorController = require("../controllers/errorController");

const app = express();
const mongo_uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://vercel-admin-user:E9596XTjPTrwIXLN@cluster0.rjrxhmc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const SessionStore = MongoStore.create({ mongoUrl: mongo_uri });

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(flash());

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

app.use(authRouter);
app.use(clientRouter);
app.use("/api/v1/appointments", appointmentsRouter);
app.use("/api/v1/applicants", applicantsRouter);
app.use(express.static(path.join(__dirname, "../public")));

app.use(errorController);

module.exports = app;
