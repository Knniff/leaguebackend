// apiService uses a package to call the official riot api
const apiService = require("../_helpers/api.service");
const ErrorHelper = require("../_helpers/error-helper");
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

async function matchlist(summonerId) {
  let rawData = fs.readFileSync("./_helpers/patches.json");
  const patches = JSON.parse(rawData);
  const summoner = await Summoner.find({ summonerId: summonerId });
  const apiMatchlist = await apiService
    .matchlist(summoner.accountId)
    .catch((err) => {
      throw err;
    });

  apiMatchlist.forEach((element) => {
    let match = new Match();
    match.matchId = element.gameId;
    match.summonerId = summonerId;
    match.championId = element.champion;
  });
}
