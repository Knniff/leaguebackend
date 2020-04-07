const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema(
  {
    matchId: { type: Number, required: true },
    first_drake: { type: Boolean, required: true },
    first_baron: { type: Boolean, required: true },
    first_herald: { type: Boolean, required: true },
    first_inhibitor: { type: Boolean, required: true },
    side: { type: Number, required: true },
  },
  { timestamps: true },
);

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Team", schema);
