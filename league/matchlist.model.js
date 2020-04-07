const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema(
  {
    matchId: { type: Number, required: true },
    summonerId: { type: String, required: true },
  },
  { timestamps: true },
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Matchlist", schema);
