const mongoose = require("mongoose");

const { Schema } = mongoose;
const traits = new Schema({
  name: { type: String, required: true },
  num_units: { type: Number, required: true },
  style: { type: Number, required: true },
  tier_current: { type: Number, required: true },
  tier_total: { type: Number, required: true },
});

const units = new Schema({
  character_id: { type: String, required: true },
  items: { type: Array, required: true },
  name: { type: String },
  rarity: { type: Number, required: true },
  tier: { type: Number, required: true },
});
const schema = new Schema(
  {
    matchId: { type: String, required: true, index: true },
    traits: { type: [traits], required: true },
    units: { type: [units], required: true },
    companion: { type: String },
  },
  { timestamps: true },
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Meta", schema);
