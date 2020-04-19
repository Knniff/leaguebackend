// apiService uses a package to call the official riot api
const apiService = require("../_helpers/api.service");
const ErrorHelper = require("../_helpers/error-helper");
const fs = require("fs");
//instantiating the database: look at the database file for more info
const db = require("../_helpers/db");
// loads the Models
const {
  Match,
  Matchlist,
  Stats,
  Team,
  Participant,
  Ban,
  Summoner,
} = db;

async function tenMatch(matchList, count) {
  var getMatches = matchList.map((match) => {
    return apiService.match(match.gameId).catch((err) => {
      console.log(err);
    });
  });
  var matches = await Promise.all(getMatches);
  matches = JSON.stringify(matches);
  fs.appendFileSync(count + "match.txt", matches);
  console.log(count);
}

async function allMatches(summonerId) {
  let rawData = fs.readFileSync("./_helpers/patches.json");
  const patches = JSON.parse(rawData);
  const summoner = await Summoner.find({ summonerId: summonerId });
  console.log(summoner);
  const apiMatchlist = await apiService
    .matchlist("ps_2AetC-Orri7swRFVOFAU6KOMlnV2B-P5CfmEXge-Vta0")
    .catch((err) => {
      throw err;
    });

  for (
    let index = 0;
    index < apiMatchlist.length;
    index = index + 10
  ) {
    let temp = [];
    temp = apiMatchlist.slice(index, index + 10);
    tenMatch(temp, index);
  }

  return;
}

module.exports = {
  allMatches,
};
