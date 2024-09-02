require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const expressJWT = require("express-jwt");
const RateLimit = require("express-rate-limit");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

app.use(express.static(__dirname + "/client/build"));
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

const db = mongoose.connection;

db.on("open", () => {
  console.log(`Connected to Mongo on ${db.host}: ${db.port}`);
});
db.on("error", (err) => {
  console.log(`Database error:\n${err}`);
});

app.use("/api/auth/login", loginLimiter);
app.use("/api/auth/signup", signupLimiter);

app.use("/api/auth", require("./routes/auth"));
app.use(
  "/api/user",
  expressJWT({ secret: process.env.JWT_SECRET }),
  require("./routes/user"),
);
app.use(
  "/api/ride",
  expressJWT({ secret: process.env.JWT_SECRET }),
  require("./routes/ride"),
);
app.use(
  "/api/mountains",
  expressJWT({ secret: process.env.JWT_SECRET }),
  require("./routes/mountain"),
);
app.use(
  "/api/share",
  expressJWT({ secret: process.env.JWT_SECRET }),
  require("./routes/share"),
);

app.get("*", (err, res) => {
  console.log("GET *");
  res.send(__dirname + "/client/build/index.html");
});

const port = process.env.PORT || 5000;
const nodeEnv = process.env.NODE_ENV || "development";
app.listen(port, () => {
  console.log(
    `You're listening to the sweet sounds of ${port} mountainroad in the morning...`,
  );
  console.log(`Oh, and the port is`, port);
  console.log(`Node environment: ${nodeEnv}`);
});
