require("dotenv").config();
const Mountain = require("./models/mountain");
const mongoose = require("mongoose");
const mountains = [
  {
    name: "Crystal Mountain",
    website: "www.crystalmountainresort.com",
    twitter: "https://twitter.com/crystalmt?lang=en",
    weather:
      "https://www.crystalmountainresort.com/the-mountain/mountain-report/weather-conditions/",
    sizzle:
      "The Largest ski resort in Washington State with 2,600 acres and over 50 named runs. Skiers and Snowboarders from all around Washington, the Pacific Northwest and the world flock to Crystal Mountain for the incredible terrain, breathtaking views of Mt. Rainier and Washington’s only Gondola.",
  },
  {
    name: "Stevens Pass",
    website: "",
    twitter: "",
    weather: "",
    sizzle:
      "Skiing at Stevens Pass is truly a unique experience; a great way to wind down after work, or just get your turns in without worrying about crowds",
  },
  {
    name: "The Summit at Snoqualmie",
    website: "",
    twitter: "",
    weather: "",
    sizzle:
      "Seattle's Home Mountain! The Summit has four unique areas and the most night skiing in Washington, plus snow tubing and Nordic skiing. All just an hour from the city on I-90",
  },
];

mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.on("open", () => {
  console.log(`Connected to Mongo on ${db.host}: ${db.port}`);
});
db.on("error", (err) => {
  console.log(`Database error:\n${err}`);
});

async function makeMtns(mtns) {
  console.log("starting");
  for (mtn of mtns) {
    try {
      let raw = new Mountain(mtn);
      let saved = await raw.save();
      console.log("saved", saved);
    } catch (err) {
      console.log("error", err);
    }
  }
  db.close();
}

makeMtns(mountains);
