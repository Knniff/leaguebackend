const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema(
  {
    matchId: { type: Number, required: true },
    summonerId: { type: String, required: true },
    role: { type: String, required: true },
    lane: { type: String, required: true },
    championId: { type: Number, required: true },
    side: { type: Number, required: true },
  },
  { timestamps: true },
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Participant", schema);
