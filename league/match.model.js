const mongoose = require("mongoose");

const { Schema } = mongoose;
const banSchema = new Schema({
  championId: {
    type: Number,
  },
  pickTurn: {
    type: Number,
  },
});

const teamSchema = new Schema(
  {
    teamId: {
      type: Number,
    },
    win: {
      type: Boolean,
    },
    firstBlood: {
      type: Boolean,
    },
    firstTower: {
      type: Boolean,
    },
    firstInhibitor: {
      type: Boolean,
    },
    firstBaron: {
      type: Boolean,
    },
    firstDragon: {
      type: Boolean,
    },
    firstRiftHerald: {
      type: Boolean,
    },
    towerKills: {
      type: Number,
    },
    inhibitorKills: {
      type: Number,
    },
    baronKills: {
      type: Number,
    },
    dragonKills: {
      type: Number,
    },
    vilemawKills: {
      type: Number,
    },
    riftHeraldKills: {
      type: Number,
    },
    dominionVictoryScore: {
      type: Number,
    },
    bans: {
      type: [banSchema],
    },
  },
  { timestamps: true },
);

const schema = new Schema(
  {
    matchId: { type: Number, required: true, index: true },
    serverId: { type: String, required: true },
    type: { type: String, required: true, index: true },
    mode: { type: String, required: true, index: true },
    mapId: { type: Number, required: true, index: true },
    duration: { type: Number, required: true },
    matchDate: { type: Date, required: true },
    patch: { type: Number, required: true, index: true },
    participants: { type: [String], required: true, index: true },
    teams: { type: [teamSchema], required: true },
  },
  { timestamps: true },
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Match", schema);
