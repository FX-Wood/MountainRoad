const router = require("express").Router();
const Ride = require("../models/ride");
const User = require("../models/user");
const mongoose = require("mongoose");

router
  .route("/")
  .get((req, res) => {
    console.log("GET /ride", req.originalUrl);
    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) {
        console.log("ride creation err", err);
        res.status(404).json({
          type: "error",
          message: "There was an error checking your rides",
        });
      } else {
        Ride.find({ user: mongoose.Types.ObjectId(user._id) })
          .populate("mountain")
          .exec((err, rides) => {
            if (err) {
              console.log("ride creation err", err);
              res.status(404).json({
                type: "error",
                message: "There was an error checking your rides",
              });
            } else {
              console.log("found rides", rides);
              res.status(200).json({
                type: "success",
                message: `Found your open rides`,
                data: { rides, phoneNumber: user.profile.phoneNumber },
              });
            }
          });
      }
    });
  })
  .post((req, res) => {
    console.log("POST /ride", req.originalUrl);
    console.log(req.user);

    User.findOne({ email: req.user.email }, (err, user) => {
      if (err) {
        console.log("ride creation err", err);
        res.status(404).json({
          type: "error",
          message: "There was an error creating your ride",
        });
      } else {
        console.log("found user", user, user._id);
        const data = req.body;
        data.user = user._id;
        const ride = new Ride(data);
        console.log(ride);
        ride.save((err, ride) => {
          if (err) {
            console.log("ride creation err", err);
            res.status(404).json({
              type: "error",
              message: "There was an error creating your ride",
            });
          } else {
            console.log("success!", ride);
            res.status(201).json({
              type: "success",
              message: `Hitting the hill on ${ride.start}`,
            });
          }
        });
      }
    });
  });
router
  .route("/:id")
  .get((req, res) => {
    console.log("GET /ride/:id", req.originalUrl);
    console.log("req.params", req.params);
    Ride.findById(req.params.id, (err, ride) => {
      if (err) {
        console.log("ride deletion err", err);
        res.status(404).json({
          type: "error",
          message: "There was an error getting your ride",
        });
      } else {
        console.log("ride found");
        res
          .status(200)
          .json({ type: "success", message: "Ride found", data: ride });
      }
    });
  })
  .put((req, res) => {
    console.log("PUT /ride/:id", req.originalUrl);
    User.find({ email: req.user.email }, (err, user) => {
      if (err) {
        console.log("ride update err", err);
        res.status(404).json({
          type: "error",
          message: "There was an error updating your ride",
        });
      } else {
        console.log("found user");
        const data = req.body;
        console.log(data);
        Ride.findByIdAndUpdate({ _id: req.params.id }, data, (err, updated) => {
          if (err) {
            console.log("ride update err", err);
            res.status(404).json({
              type: "error",
              message: "There was an error updating your ride",
            });
          } else {
            console.log(updated);
            res.status(200).json({
              type: "success",
              message: `updated ride ${req.params.id}`,
              data: null,
            });
          }
        });
      }
    });
  })
  .delete((req, res) => {
    console.log("DELETE /ride/:id", req.originalUrl);
    User.find({ email: req.user.email }, (err, user) => {
      if (err) {
        console.log("ride deletion err", err);
        res.status(404).json({
          type: "error",
          message: "There was an error deleting your ride",
        });
      } else {
        Ride.findByIdAndDelete({ _id: req.params.id }, (err, deleted) => {
          if (err) {
            console.log("ride deletion err", err);
            res.status(404).json({
              type: "error",
              message: "There was an error deleting your ride",
            });
          } else {
            res
              .status(200)
              .json({ type: "success", message: `Deleted`, data: null });
          }
        });
      }
    });
  });
module.exports = router;

