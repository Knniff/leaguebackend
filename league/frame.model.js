const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema({
  matchId: {
    type: Number,
    required: true,
    index: true,
  },
  timestamp: { type: Number, required: true, index: true },
  participantId: { type: String, required: true, index: true },
  position: { x: { type: Number }, y: { type: Number } },
  currentGold: { type: Number },
  totalGold: { type: Number },
  level: { type: Number, index: true },
  xp: { type: Number },
  minionsKilled: { type: Number },
  jungleMinionsKilled: { type: Number },
  dominionScore: { type: Number },
  teamScore: { type: Number },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Frame", schema);
