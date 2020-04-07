const mongoose = require("mongoose");

const { Schema } = mongoose;

const schema = new Schema(
  {
    summonerId: { type: String, required: true },
    matchId: { type: Number, required: true },
    spell1Id: { type: Number },
    spell2Id: { type: Number },
    win: {
      type: Boolean,
    },
    item0: {
      type: Number,
    },
    item1: {
      type: Number,
    },
    item2: {
      type: Number,
    },
    item3: {
      type: Number,
    },
    item4: {
      type: Number,
    },
    item5: {
      type: Number,
    },
    item6: {
      type: Number,
    },
    kills: {
      type: Number,
    },
    deaths: {
      type: Number,
    },
    assists: {
      type: Number,
    },
    largestKillingSpree: {
      type: Number,
    },
    largestMultiKill: {
      type: Number,
    },
    killingSprees: {
      type: Number,
    },
    longestTimeSpentLiving: {
      type: Number,
    },
    doubleKills: {
      type: Number,
    },
    tripleKills: {
      type: Number,
    },
    quadraKills: {
      type: Number,
    },
    pentaKills: {
      type: Number,
    },
    unrealKills: {
      type: Number,
    },
    totalDamageDealt: {
      type: Number,
    },
    magicDamageDealt: {
      type: Number,
    },
    physicalDamageDealt: {
      type: Number,
    },
    trueDamageDealt: {
      type: Number,
    },
    largestCriticalStrike: {
      type: Number,
    },
    totalDamageDealtToChampions: {
      type: Number,
    },
    magicDamageDealtToChampions: {
      type: Number,
    },
    physicalDamageDealtToChampions: {
      type: Number,
    },
    trueDamageDealtToChampions: {
      type: Number,
    },
    totalHeal: {
      type: Number,
    },
    totalUnitsHealed: {
      type: Number,
    },
    damageSelfMitigated: {
      type: Number,
    },
    damageDealtToObjectives: {
      type: Number,
    },
    damageDealtToTurrets: {
      type: Number,
    },
    visionScore: {
      type: Number,
    },
    timeCCingOthers: {
      type: Number,
    },
    totalDamageTaken: {
      type: Number,
    },
    magicalDamageTaken: {
      type: Number,
    },
    physicalDamageTaken: {
      type: Number,
    },
    trueDamageTaken: {
      type: Number,
    },
    goldEarned: {
      type: Number,
    },
    goldSpent: {
      type: Number,
    },
    turretKills: {
      type: Number,
    },
    inhibitorKills: {
      type: Number,
    },
    totalMinionsKilled: {
      type: Number,
    },
    neutralMinionsKilled: {
      type: Number,
    },
    neutralMinionsKilledTeamJungle: {
      type: Number,
    },
    neutralMinionsKilledEnemyJungle: {
      type: Number,
    },
    totalTimeCrowdControlDealt: {
      type: Number,
    },
    champLevel: {
      type: Number,
    },
    visionWardsBoughtInGame: {
      type: Number,
    },
    sightWardsBoughtInGame: {
      type: Number,
    },
    wardsPlaced: {
      type: Number,
    },
    wardsKilled: {
      type: Number,
    },
    firstBloodKill: {
      type: Boolean,
    },
    firstBloodAssist: {
      type: Boolean,
    },
    firstTowerKill: {
      type: Boolean,
    },
    firstTowerAssist: {
      type: Boolean,
    },
    firstInhibitorKill: {
      type: Boolean,
    },
    firstInhibitorAssist: {
      type: Boolean,
    },
    perk0: {
      type: Number,
    },
    perk1: {
      type: Number,
    },
    perk2: {
      type: Number,
    },
    perk3: {
      type: Number,
    },
    perk4: {
      type: Number,
    },
    perk5: {
      type: Number,
    },
    perkPrimaryStyle: {
      type: Number,
    },
    perkSubStyle: {
      type: Number,
    },
    statPerk0: {
      type: Number,
    },
    statPerk1: {
      type: Number,
    },
    statPerk2: {
      type: Number,
    },
    creepsPerMinDeltas: { type: Map, of: Number },
    xpPerMinDeltas: { type: Map, of: Number },
    goldPerMinDeltas: { type: Map, of: Number },
    csDiffPerMinDeltas: { type: Map, of: Number },
    xpDiffPerMinDeltas: { type: Map, of: Number },
    damageTakenPerMinDeltas: { type: Map, of: Number },
    damageTakenDiffPerMinDeltas: { type: Map, of: Number },
  },
  { timestamps: true },
);
//  https://mongoosejs.com/docs/schematypes.html#maps

schema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Stats", schema);
