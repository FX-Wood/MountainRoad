const router = require("express").Router();
const Ride = require("../models/ride");
const User = require("../models/user");

router.get("/", (req, res) => {
  console.log("GET /share");
  Ride.find()
    .populate({ path: "user", path: "mountain" })
    .exec((err, rides) => {
      if (err) {
        console.log("error finding rides");
        res.status(500).json({ type: "error", message: "error finding rides" });
      } else {
        console.log("found rides");
        console.log(rides);
        res
          .status(200)
          .json({ type: "success", message: "found rides", data: rides });
      }
    });
});
router.get("/users", (req, res) => {
  console.log("GET /share/users");
  User.find((err, users) => {
    if (err) {
      console.log(err);
      res.json({ type: "error", message: "there was an error getting users" });
    } else {
      console.log("found users");
      let safeUsers = users.map((user) => user.safe);
      res.json({ type: "success", message: "users found", data: safeUsers });
    }
  });
});

router.get("/profiles", (req, res) => {
  console.log("GET /share/profiles");
  Profile.find((err, profiles) => {
    if (err) {
      console.log(err);
      res.json({
        type: "error",
        message: "there was an error getting profiles",
      });
    } else {
      console.log("found profiles");
      res.json({ type: "success", message: "users found", data: profiles });
    }
  });
});
module.exports = router;

