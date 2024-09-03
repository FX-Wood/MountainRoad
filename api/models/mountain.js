const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mountainSchema = new Schema({
  name: String,
  website: String,
  twitter: String,
  weather: String,
  sizzle: String,
  drives: [{ type: Schema.Types.ObjectId, ref: "Drive" }],
  rides: [{ type: Schema.Types.ObjectId, ref: "Ride" }],
  temperatureAtBase: Number,
});

module.exports = mongoose.model("Mountain", mountainSchema);

