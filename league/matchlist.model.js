const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema(
  {
    matchId: { type: Number, required: true, index: true },
    summonerId: { type: String, required: true, index: true },
    championId: { type: Number, required: true, index: true },
    patch: { type: Number, required: true, index: true },
    role: { type: String, required: false, index: true },
  },
  { timestamps: true },
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Matchlist", schema);
