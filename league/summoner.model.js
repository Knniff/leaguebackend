const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema(
  {
    summonerId: { type: String, required: true },
    accountId: { type: String, required: true },
    puuid: { type: String, required: true },
    summonerName: { type: String, required: true },
    summonerLevel: { type: Number, required: true },
    iconId: { type: Number, required: true },
    serverId: { type: String, required: true },
  },
  { timestamps: true },
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Summoner", schema);
