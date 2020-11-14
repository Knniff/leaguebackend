const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema({
  matchId: {
    type: Number,
    required: true,
    index: true,
  },
  killerId: { type: String, index: true, sparse: true },
  assistingParticipantIds: {
    type: [String],
    required: false,
    index: true,
    sparse: true,
    default: undefined,
  },
  victimId: { type: String, index: true, sparse: true },
  creatorId: { type: String, index: true, sparse: true },
  participantId: { type: String, index: true, sparse: true },

  afterId: { type: Number },
  beforeId: { type: Number },
  type: { type: String, required: true, index: true },
  timestamp: { type: Number, required: true, index: true },
  laneType: { type: String },
  skillSlot: { type: Number },
  ascendedType: { type: String },
  eventType: { type: String },
  levelUpType: { type: String },
  wardType: { type: String },
  towerType: { type: String },
  itemId: { type: Number },
  pointCaptured: { type: String },
  monsterType: { type: String },
  monsterSubType: { type: String },
  teamId: { type: Number },
  position: {
    x: { type: Number },
    y: { type: Number },
  },
  buildingType: { type: String },
});

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Event", schema);
