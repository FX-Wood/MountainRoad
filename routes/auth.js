const express = require("express");
const router = express.Router();
const User = require("../models/user");
const JWT = require("jsonwebtoken");
const fs = require("fs");
const crypto = require("crypto");

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const multer = require("multer");
const storage = multer.memoryStorage();
const imageParser = multer({ storage });

// profile schema
// email: '',
// password: '',
// first: '',
// last: '',
// profilePicture: null,
// skier: false,
// snowboarder: false,
// complicated: false,
// homeMountain: ''

// Route for signup
router.post(
  "/signup",
  imageParser.single("profilePicture"),
  async (req, res) => {
    console.log(req.file);
    console.log("POST /signup", req.body);
    // see if the email is already in the db
    const {
      first,
      last,
      skier,
      phoneNumber,
      snowboarder,
      complicated,
      homeMountain,
    } = req.body;
    User.findOne({ email: req.body.email }, (err, user) => {
      console.log("POST /signup, {err, user}", { err, user });
      // if db error, catch it
      if (err) {
        console.log("signup err", err);
        res.status(500).json({ type: "error", message: err.message });
      }
      // if email exists, return an error
      if (user) {
        console.log("User exists", req.body.email);
        // return a 404 to
        res
          .status(400)
          .json({
            type: "error",
            message: "A user with that email address already exists",
          });
      } else {
        // if no, create the user in the db

        let user = new User({
          email: req.body.email,
          password: req.body.password,
        });
        user.profile = {
          first,
          last,
          skier,
          phoneNumber,
          snowboarder,
          complicated,
          homeMountain,
        };
        user.profile.profilePicture = req.file;

        console.log("user instance", user);
        user.save((err, newUser) => {
          console.log("done saving, here are the results", { err, newUser });
          if (err) {
            console.log("save err", err);
            // this error message is deliberately vague. The front end should supply more robust feedback
            res
              .status(404)
              .json({
                type: "error",
                message: "There was an error creating the user",
              });
          } else {
            console.log("created user", newUser);
            // sign a token (this is the login step)
            var token = JWT.sign(user.toObject(), process.env.JWT_SECRET, {
              expiresIn: 60 * 30,
            });
            // return the token
            console.log(
              "here is the reply",
              JSON.stringify({ newUser: newUser.safe, token }),
            );
            res
              .status(201)
              .json({
                type: "success",
                message: `Account creation successful. Welcome ${newUser.name}!`,
                user: newUser.safe,
                token,
              });
          }
        });
      }
    });
  },
);
// Route for login
router.post("/login", (req, res) => {
  console.log("POST /login", req.body);
  // Find user in db
  User.findOne({ email: req.body.email }, (err, user) => {
    console.log("findOne user:", { err, user });
    if (!user) {
      // if no user, return error
      res.json({ type: "error", message: "Account not found" });
    } else {
      // if user, check authentication
      if (!err) {
        // if authenticated, sign a token (login)
        console.log("no err, found user,", user, err);
        if (user.authenticated(req.body.password)) {
          var token = JWT.sign(user.toObject(), process.env.JWT_SECRET, {
            // expiresIn uses zeit/ms to parse timestrings
            expiresIn: "30 minutes",
          });
          // return the token
          console.log(
            "here is the login reply",
            JSON.stringify({
              type: "success",
              message: "Login successful",
              user: user.safe,
              token,
            }),
          );
          res.json({
            type: "success",
            message: "Login successful",
            user: user.safe,
            token,
          });
        } else {
          res
            .status(401)
            .json({
              type: "error",
              message: "Incorrect password. Please try again",
            });
        }
      } else {
        res.status(500).json(err);
      }
    }
  });
});
// Route for token validation
router.post("/me/from/token", (req, res) => {
  console.log("POST /me/from/token", req.originalUrl, Object.keys(req.body));
  // make sure they sent us a token to check
  let token = req.body.token;
  if (!token) {
    // If no token, return error
    res.json({ type: "error", message: "You must pass a valid token!" });
  } else {
    // If token, verify it
    JWT.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      console.log("JWT.verify", { err, decodedToken });
      if (err) {
        // If invalid, return an error
        res.json({
          type: "error",
          message: "Invalid token. Please log in again",
        });
      } else {
        // If token is valid...
        //   Look up the user in the db
        User.findOne({ email: decodedToken.email }, (err, user) => {
          //   If user doesn't exist, return an error
          if (err || !user) {
            res.json({ type: "error", message: "Couldn't find user" });
          } else {
            //   If user exists, send user and token back to React
            console.log("found user:", user.safe);
            res.json({
              type: "success",
              message: "Valid token",
              user: user.safe,
              token,
            });
          }
        });
      }
    });
  }
});

// Route for logout

module.exports = router;
