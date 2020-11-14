const TeemoJS = require("teemojs");
let api = TeemoJS(process.env.RGAPI);
const ErrorHelper = require("./error-helper");

// using a package the Riot-API is called
//https://github.com/MingweiSamuel/TeemoJS
async function summonerById(summonerId) {
  const data = api
    .get("euw1", "summoner.getBySummonerId", summonerId)
    .catch((err) => {
      console.log(err);
      throw new ErrorHelper(
        "Internal Server Error",
        err.status_code,
        err.message,
      );
    });
  if (data.status) {
    throw new ErrorHelper(
      "Internal Server Error",
      data.status.status_code,
      "Riot-API failure or wrong API-key.",
    );
  }
  return data;
}

async function summonerByName(name) {
  const data = await api.get(
    "euw1",
    "summoner.getBySummonerName",
    name,
  );
  if (!data) {
    throw new ErrorHelper(
      "Internal Server Error",
      500,
      "No Summoner found under this Name.",
    );
  } else if (data.status) {
    throw new ErrorHelper(
      "Internal Server Error",
      403,
      "Riot-API failure or wrong API-key.",
    );
  } else {
    return data;
  }
}

async function mastery(summonerId) {
  const data = await api.get(
    "euw1",
    "championMastery.getAllChampionMasteries",
    summonerId,
  );
  if (!data) {
    throw new ErrorHelper(
      "Internal Server Error",
      500,
      "No Mastery found with this Id.",
    );
  } else if (data.status) {
    throw new ErrorHelper("Forbidden", 403, "Wrong Riot-API key.");
  } else {
    return data;
  }
}

async function match(matchId) {
  const data = await api
    .get("euw1", "match.getMatch", matchId)
    .catch((err) => {
      console.log(err);
      throw new ErrorHelper(
        "Internal Server Error",
        err.status_code,
        err.message,
      );
    });
  return data;
}

async function matchlist(accountId) {
  var count = 0;
  var matchlist = [];
  var beginIndex = 0;
  while (1 === 1) {
    const data = await api
      .get("euw1", "match.getMatchlist", accountId, {
        beginIndex: beginIndex,
      })
      .catch((err) => {
        console.log(err);
        throw new ErrorHelper(
          "Internal Server Error",
          err.status_code,
          err.message,
        );
      });
    if (data.status) {
      throw new ErrorHelper(
        "Internal Server Error",
        data.status.status_code,
        "Riot-API failure or wrong API-key.",
      );
    }
    if (!data.matches.length) {
      break;
    }
    matchlist = matchlist.concat(data.matches);
    beginIndex = beginIndex + 100;
  }
  matchlist.forEach((element) => {
    element.timestamp = new Date(element.timestamp);
  });
  return matchlist;
}

async function matchtimeline(matchId) {
  const data = await api.get(
    "euw1",
    "match.getMatchTimeline",
    matchId,
  );
  return data;
}

module.exports = {
  summonerById,
  summonerByName,
  mastery,
  match,
  matchlist,
  matchtimeline,
};
