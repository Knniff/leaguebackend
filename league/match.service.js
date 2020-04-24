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

async function saveMatches(matchList) {
  var save = [];
  var getMatches = matchList.map((tempor) => {
    return apiService.match(tempor.gameId).catch((err) => {
      console.log(err);
    });
  });
  var matches = await Promise.all(getMatches);

  matches.forEach((element) => {
    let match = new Match();
    match.matchId = element.gameId;
    match.serverId = element.platformId;
    match.type = element.gameType;
    match.mode = element.gameMode;
    match.mapId = element.mapId;
    match.duration = element.gameDuration;
    match.matchDate = new Date(element.gameCreation);
    // patch
    let tempPatch = element.gameVersion.split(".");
    match.patch = tempPatch[0] + "." + tempPatch[1];

    // participants
    element.participantIdentities.forEach((element1) => {
      match.participants.push(element1.player.summonerId);
    });
    //teams
    element.teams.forEach((element2) => {
      let tempwin;
      if (element2.win === "Win") {
        tempwin = true;
      } else {
        tempwin = false;
      }
      let data = {
        teamId: element2.teamId,
        win: tempwin,
        firstBlood: element2.firstBlood,
        firstTower: element2.firstTower,
        firstInhibitor: element2.firstInhibitor,
        firstBaron: element2.firstBaron,
        firstDragon: element2.firstDragon,
        firstRiftHerald: element2.firstRiftHerald,
        towerKills: element2.towerKills,
        inhibitorKills: element2.inhibitorKills,
        baronKills: element2.baronKills,
        dragonKills: element2.dragonKills,
        vilemawKills: element2.vilemawKills,
        riftHeraldKills: element2.riftHeraldKills,
        bans: [],
      };

      element2.bans.forEach((element3) => {
        data.bans.push(element3);
      });
      match.teams.push(data);
    });
    console.log(match);
    save.push(match);
  });
  Match.insertMany(save);
}

async function allMatches(summonerId) {
  const match = await Match.findOne({
    participants: summonerId,
  }).sort({ matchDate: -1 });

  var summoner = await Summoner.find({ summonerId: summonerId });
  summoner = summoner[0];
  const apiMatchlist = await apiService
    .matchlist(summoner.accountId)
    .catch((err) => {
      throw err;
    });
  if (match) {
    latestMatch = new Date(match.matchDate);
    var newMatches = [];
    apiMatchlist.forEach((ele) => {
      var matchDate = new Date(ele.timestamp);
      if (matchDate > latestMatch) {
        newMatches.push(ele);
      }
    });
    if (!newMatches.length) {
      return "No new Matches";
    }

    for (
      let index = 0;
      index < newMatches.length;
      index = index + 10
    ) {
      let temp = [];
      temp = newMatches.slice(index, index + 10);
      saveMatches(temp);
    }

    return "Processing " + newMatches.length + " Matche(s).";
  } else {
    for (
      let index = 0;
      index < apiMatchlist.length;
      index = index + 10
    ) {
      let temp = [];
      temp = apiMatchlist.slice(index, index + 10);
      saveMatches(temp);
    }

    return "Processing " + apiMatchlist.length + " Matche(s).";
  }
}

module.exports = {
  allMatches,
};
