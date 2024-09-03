const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
  seats: Number,
  seatsTaken: Number,
  shotgun: Boolean,
  "4wd": Boolean,
  awd: Boolean,
  chains: Boolean,
  roofrack: Boolean,
  roofcargo: Boolean,
});

mongoose.model("Car", carSchema);

const driveSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  car: carSchema,
  riders: [{ type: Schema.Types.ObjectId, ref: "User" }],
  cost: Number,
  date: String,
  goHour: Number,
  goMin: Number,
  goNote: String,
  endHour: Number,
  endMin: Number,
  endNote: String,
  note: String,
});

module.exports = mongoose.model("Drive", driveSchema);

