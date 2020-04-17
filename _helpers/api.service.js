const TeemoJS = require("teemojs");
let api = TeemoJS(process.env.RGAPI);
const ErrorHelper = require("./error-helper");
const fs = require("fs");

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
  const data = await api.get("euw1", "match.getMatch", matchId);
  return data;
}

async function tft_challenger(matchId) {
  const data = await api.get("euw1", "match.getMatch", matchId);
  return data;
}

async function matchlist(accountId) {
  var count = 0;
  var matchlist = [];
  var beginIndex = 0;
  /*   let rawData = fs.readFileSync("./_helpers/patches.json");
  const patches = JSON.parse(rawData);
  var tempstart = 0;
  var tempend = 0;
  season = 10;
  //patch = 10.8;
  if (season && !patch) {
    let startindex = -1;
    let endindex = -1;
    let start;
    let end;
    start = (season + 0.1).toString();
    end = (start + 1).toString();
    startindex = patches.patches.findIndex(
      (element) => element.name === start,
    );
    endindex = patches.patches.findIndex(
      (element) => element.name === end,
    );
    tempstart = patches.patches[startindex].start;
    if (!patches.patches[endindex]) {
      tempend = Date.now();
    } else {
      tempend = patches.patches[endindex].start;
    }
    console.log(tempend - tempstart);
  } else if (!season && patch) {
    let startindex = -1;
    let endindex = -1;
    let start;
    let end;
    start = patch.toString();
    end = (patch + 0.1).toString();
    startindex = patches.patches.findIndex(
      (element) => element.name === start,
    );
    endindex = patches.patches.findIndex(
      (element) => element.name === end,
    );
    tempstart = patches.patches[startindex].start;
    if (!patches.patches[endindex]) {
      tempend = Date.now();
    } else {
      tempend = patches.patches[endindex].start;
    }
    console.log(tempend - tempstart);
  } */
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
      console.log("break");
      break;
    }
    matchlist = matchlist.concat(data.matches);
    beginIndex = beginIndex + 100;
    console.log(beginIndex);
  }

  matchlist.forEach((element) => {
    count = count + 1;
    element.timestamp = new Date(element.timestamp);
  });
  console.log(count);
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
