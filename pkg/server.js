require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const expressJWT = require("express-jwt");
const RateLimit = require("express-rate-limit");
const morgan = require("morgan");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan("combined"));

const loginLimiter = new RateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  delayMs: 0, // disabled
  message: JSON.stringify({
    type: "error",
    message: "Maximum login attempts exceeded!",
  }),
});

const signupLimiter = new RateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  delayMs: 0, // disabled
  message: JSON.stringify({
    type: "error",
    message: "Account creation maximum exceeded!",
  }),
});

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on("open", () => {
  console.log(`Connected to Mongo on ${db.host}: ${db.port}`);
});
db.on("error", (err) => {
  console.log(`Database error:\n${err}`);
});

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/signup", signupLimiter);

app.get("/api/alive", (req, res) =>
  res.json({ message: "mountainroad api v1" }),
);
app.use("/api/auth", require("../pkg/routes/auth"));
app.use(
  "/api/user",
  expressJWT({ secret: process.env.JWT_SECRET }),
  require("../pkg/routes/user"),
);
app.use(
  "/api/ride",
  expressJWT({ secret: process.env.JWT_SECRET }),
  require("../pkg/routes/ride"),
);
app.use(
  "/api/mountains",
  expressJWT({ secret: process.env.JWT_SECRET }),
  require("../pkg/routes/mountain"),
);
app.use(
  "/api/share",
  expressJWT({ secret: process.env.JWT_SECRET }),
  require("../pkg/routes/share"),
);
module.exports = app;
