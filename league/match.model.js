const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema(
  {
    matchId: { type: Number, required: true },
    platformId: { type: String, required: true },
    seasonId: { type: Number, required: true },
    mapId: { type: Number, required: true },
    duration: { type: Number, required: true },
    gameDate: { type: Date, required: true },
  },
  { timestamps: true },
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Match", schema);
