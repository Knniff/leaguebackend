// apiService uses a package to call the official riot api
const apiService = require("../_helpers/api.service");
const ErrorHelper = require("../_helpers/error-helper");
//instatiating the database: look at the database file for more info
const db = require("../_helpers/db");
// loads the Mastery and Summoner Model
const { Mastery, Summoner } = db;

//https://engineering.mixmax.com/blog/api-paging-built-the-right-way/
// all mastery with pagination
async function mastery(next, limit) {
  if (limit > 50) {
    throw new ErrorHelper(
      "Internal Server Error",
      500,
      "Limit max is 50.",
    );
  }
  if (!limit) {
    limit = 20;
  }
  if (limit) {
    limit = parseInt(limit, 10);
  }
  var data = [];

  if (next === undefined) {
    data = await Mastery.find({})
      .sort({ championPoints: -1, _id: -1 })
      .limit(limit);
  } else {
    if (!next.includes("_")) {
      return;
    }
    const [nextChampionPoints, nextId] = next.split("_");
    if (nextId.length !== 24) {
      throw new ErrorHelper(
        "Internal Server Error",
        500,
        "Id in next key is malformed.",
      );
    }
    data = await Mastery.find({
      $or: [
        { championPoints: { $lt: nextChampionPoints } },
        { championPoints: nextChampionPoints, _id: { $lt: nextId } },
      ],
    })
      .sort({ championPoints: -1, _id: -1 })
      .limit(limit);
  }
  if (data.length) {
    const last = data[data.length - 1];
    const nextMastery = `${last.championPoints}_${last._id}`;
    const res = { mastery: data, next: nextMastery };
    return res;
  } else {
    return;
  }
}

// all mastery from one champion with pagination
async function championMastery(next, limit, championId) {
  if (limit > 50 || limit < 1) {
    throw new ErrorHelper(
      "Internal Server Error",
      500,
      "Limit max is 50 and min 1.",
    );
  }

  if (!limit) {
    limit = 20;
  }
  if (limit) {
    limit = parseInt(limit, 10);
  }
  var data = [];

  if (next === undefined) {
    data = await Mastery.find({ championId: championId })
      .sort({ championPoints: -1, _id: -1 })
      .limit(limit);
  } else {
    if (!next.includes("_")) {
      return;
    }
    const [nextChampionPoints, nextId] = next.split("_");
    if (nextId.length !== 24) {
      throw new ErrorHelper(
        "Internal Server Error",
        500,
        "Id in next key is malformed.",
      );
    }
    data = await Mastery.find({
      championId: championId,
      $or: [
        { championPoints: { $lt: nextChampionPoints } },
        { championPoints: nextChampionPoints, _id: { $lt: nextId } },
      ],
    })
      .sort({ championPoints: -1, _id: -1 })
      .limit(limit);
  }
  if (data.length) {
    const last = data[data.length - 1];
    const nextMastery = `${last.championPoints}_${last._id}`;
    const res = { mastery: data, next: nextMastery };
    return res;
  } else {
    return;
  }
}

// all mastery from one Summoner
async function summonerMastery(next, limit, summonerId) {
  if (limit > 50 || limit < 1) {
    throw new ErrorHelper(
      "Internal Server Error",
      500,
      "Limit max is 50 and min 1.",
    );
  }

  if (!limit) {
    limit = 20;
  }
  if (limit) {
    limit = parseInt(limit, 10);
  }
  var data = [];

  if (next === undefined) {
    data = await Mastery.find({ summonerId: summonerId })
      .sort({ championPoints: -1, _id: -1 })
      .limit(limit);
  } else {
    if (!next.includes("_")) {
      return;
    }
    const [nextChampionPoints, nextId] = next.split("_");
    if (nextId.length !== 24) {
      throw new ErrorHelper(
        "Internal Server Error",
        500,
        "Id in next key is malformed.",
      );
    }
    data = await Mastery.find({
      summonerId: summonerId,
      $or: [
        { championPoints: { $lt: nextChampionPoints } },
        { championPoints: nextChampionPoints, _id: { $lt: nextId } },
      ],
    })
      .sort({ championPoints: -1, _id: -1 })
      .limit(limit);
  }
  if (data.length) {
    const last = data[data.length - 1];
    const nextMastery = `${last.championPoints}_${last._id}`;
    const res = { mastery: data, next: nextMastery };
    return res;
  } else {
    return;
  }
}

// add summoner and mastery or update summoner
async function summoner(summonerId) {
  const oldSummoner = await Summoner.findOne({
    summonerId: summonerId,
  });
  if (oldSummoner) {
    const data = await apiService
      .summonerById(summonerId)
      .catch((err) => {
        throw err;
      });
    oldSummoner.summonerName = data.name;
    oldSummoner.summonerLevel = data.summonerLevel;
    oldSummoner.iconId = data.profileIconId;
    oldSummoner.save();
    return oldSummoner;
  } else {
    const data = await apiService
      .summonerById(summonerId)
      .catch((err) => {
        throw err;
      });
    const summoner = new Summoner();
    summoner.summonerId = data.id;
    summoner.accountId = data.accountId;
    summoner.puuid = data.puuid;
    summoner.summonerName = data.name;
    summoner.summonerLevel = data.summonerLevel;
    summoner.iconId = data.profileIconId;
    summoner.serverId = "EUW";
    summoner.save();
    const masteryData = await apiService
      .mastery(summonerId)
      .catch((err) => {
        throw err;
      });
    Mastery.insertMany(masteryData);
    return summoner;
  }
}

// update masteries from one Summoner
async function updateMastery(summonerId) {
  var temp = [];
  const masteryData = await apiService
    .mastery(summonerId)
    .catch((err) => {
      throw err;
    });

  var oldMasteryData = await Mastery.find({ summonerId: summonerId });
  for (let index = 0; index < masteryData.length; index++) {
    let masteryIndex = oldMasteryData.findIndex(
      (x) => x.championId === masteryData[index].championId,
    );
    try {
      masteryData[index]._id = oldMasteryData[masteryIndex]._id;
    } catch (error) {
      temp.push(index);

      const mastery = new Mastery(masteryData[index]);
      mastery.save();
    }
  }

  if (temp) {
    for (let index = temp.length - 1; index >= 0; index--) {
      masteryData.splice(temp[index], 1);
    }
  }

  const bulkOps = masteryData.map((masteryData) => ({
    updateOne: {
      filter: { _id: masteryData._id },
      update: masteryData,
      upsert: true,
    },
  }));

  Mastery.bulkWrite(bulkOps)
    .then((bulkWriteOpResult) => {
      return bulkWriteOpResult;
    })
    .catch((err) => {
      throw new ErrorHelper("Internal Server Error", 500, err);
    });
}

async function masteryStats(id) {
  var stats = {
    type: "All",
    totalMasteries: 0,
    combinedLevel: 0,
    combinedChampionPoints: 0,
    combinedChestsGranted: 0,
  };

  if (id.length === 47) {
    var masteryData = await Mastery.find({ summonerId: id });
    stats.type = id;
    masteryData.forEach((element) => {
      stats.totalMasteries = stats.totalMasteries + 1;
      stats.combinedLevel =
        stats.combinedLevel + element.championLevel;
      stats.combinedChampionPoints =
        stats.combinedChampionPoints + element.championPoints;
      if (element.chestGranted) {
        stats.combinedChestsGranted = stats.combinedChestsGranted + 1;
      }
    });
  } else if (id === "all") {
    var masteryData = await Mastery.find();
    masteryData.forEach((element) => {
      stats.totalMasteries = stats.totalMasteries + 1;
      stats.combinedLevel =
        stats.combinedLevel + element.championLevel;
      stats.combinedChampionPoints =
        stats.combinedChampionPoints + element.championPoints;
      if (element.chestGranted) {
        stats.combinedChestsGranted = stats.combinedChestsGranted + 1;
      }
    });
  } else {
    var masteryData = await Mastery.find({ championId: id });
    stats.type = id;
    masteryData.forEach((element) => {
      stats.totalMasteries = stats.totalMasteries + 1;
      stats.combinedLevel =
        stats.combinedLevel + element.championLevel;
      stats.combinedChampionPoints =
        stats.combinedChampionPoints + element.championPoints;
      if (element.chestGranted) {
        stats.combinedChestsGranted = stats.combinedChestsGranted + 1;
      }
    });
  }
  return stats;
}

module.exports = {
  summonerMastery,
  championMastery,
  updateMastery,
  masteryStats,
  summoner,
  mastery,
};
