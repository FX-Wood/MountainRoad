const router = require("express").Router();
const Mountain = require("../models/mountain");
router.get("/", (req, res) => {
  console.log("GET /api/mountains");
  Mountain.find((err, mtns) => {
    if (err) {
      console.log("error finding mountains", err);
      res
        .status(404)
        .json({
          type: "error",
          message: "There was an error getting mountain data",
        });
    } else {
      console.log("found mountains", mtns);
      res
        .status(200)
        .json({ type: "success", message: `Found mountain data`, data: mtns });
    }
  });
});
router.get("/:id/rides", (req, res) => {});
module.exports = router;

