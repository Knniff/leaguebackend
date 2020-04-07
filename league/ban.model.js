const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema(
  {
    matchId: { type: Number, required: true },
    championId: { type: Number, required: true },
    side: { type: Number, required: true },
    turn: { type: Number, required: true },
  },
  { timestamps: true },
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Ban", schema);
