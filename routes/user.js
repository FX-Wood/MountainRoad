const router = require("express").Router();
const User = require("../models/user");

router
  .route("/")
  // profile
  .get((req, res) => {
    console.log("GET /profile", req.originalUrl);
    User.findOne({ email: req.user.email }, "safe", (err, user) => {
      if (err) {
        res
          .status(500)
          .json({
            type: "error",
            message: "there was an error retrieving your profile",
            data: null,
          });
      } else {
        res
          .status(200)
          .json({ type: "success", message: "profile found", data: user });
      }
    });
  })
  .post(async (req, res) => {
    console.log("POST /profile", req.originalUrl);
    console.log(req.user);
    try {
      // find user from token email
      user = await User.findOne({ where: { email: req.user.email } }).exec();
      // update user profile
      user.profile.update(req.body);
      // save
      user.save();
      res.send("success");
    } catch (err) {
      res.send(err);
    }
  });
module.exports = router;

