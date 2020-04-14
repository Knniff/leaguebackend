const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema(
  {
    championId: {
      type: Number,
      index: true,
    },
    championLevel: {
      type: Number,
    },
    championPoints: {
      type: Number,
    },
    lastPlayTime: {
      type: Number,
    },
    championPointsSinceLastLevel: {
      type: Number,
    },
    championPointsUntilNextLevel: {
      type: Number,
    },
    chestGranted: {
      type: Boolean,
    },
    tokensEarned: {
      type: Number,
    },
    summonerId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true },
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Mastery", schema);
