// apiService uses a package to call the official riot api
const apiService = require("../_helpers/api.service");
const ErrorHelper = require("../_helpers/error-helper");
const fs = require("fs");
//instantiating the database: look at the database file for more info
const db = require("../_helpers/db");
// loads the Models
const { Match, Participant, Summoner } = db;

async function saveParticipants(
  participantIdentities,
  participants,
  matchId,
) {
  participantsToBeSaved = [];
  for (
    let outerIndex = 0;
    outerIndex < participantIdentities.length;
    outerIndex++
  ) {
    const identity = participantIdentities[outerIndex];
    for (
      let innerIndex = 0;
      innerIndex < participants.length;
      innerIndex++
    ) {
      const participant = participants[innerIndex];
      if (participant.participantId === identity.participantId) {
        let checkParticipant = await Participant.findOne({
          summonerId: identity.player.summonerId,
          matchId: matchId,
        });
        if (!checkParticipant) {
          let participantToBeSaved = new Participant();
          participantToBeSaved.summonerId =
            identity.player.summonerId;
          participantToBeSaved.matchId = matchId;
          participantToBeSaved.championId = participant.championId;
          participantToBeSaved.win = participant.stats.win;
          participantToBeSaved.teamId = participant.teamId;
          //
          if (
            participant.timeline.role === "SOLO" &&
            participant.timeline.lane === "TOP"
          ) {
            participantToBeSaved.role = "TOP";
          } else if (
            participant.timeline.role === "NONE" &&
            participant.timeline.lane === "JUNGLE"
          ) {
            participantToBeSaved.role = "JUNGLE";
          } else if (
            participant.timeline.role === "DUO_CARRY" &&
            participant.timeline.lane === "BOTTOM"
          ) {
            participantToBeSaved.role = "BOTTOM_CARRY";
          } else if (
            participant.timeline.role === "DUO_SUPPORT" &&
            participant.timeline.lane === "BOTTOM"
          ) {
            participantToBeSaved.role = "BOTTOM_SUPPORT";
          } else if (
            participant.timeline.role === "SOLO" &&
            participant.timeline.lane === "MIDDLE"
          ) {
            participantToBeSaved.role = "MIDDLE";
          } else {
            participantToBeSaved.role = "NONE";
          }
          //participantToBeSaved.role = participant. ;
          participantToBeSaved.spell1Id = participant.spell1Id;
          participantToBeSaved.spell2Id = participant.spell2Id;
          participantToBeSaved.item0 = participant.stats.item0;
          participantToBeSaved.item1 = participant.stats.item1;
          participantToBeSaved.item2 = participant.stats.item2;
          participantToBeSaved.item3 = participant.stats.item3;
          participantToBeSaved.item4 = participant.stats.item4;
          participantToBeSaved.item5 = participant.stats.item5;
          participantToBeSaved.item6 = participant.stats.item6;
          participantToBeSaved.kills = participant.stats.kills;
          participantToBeSaved.deaths = participant.stats.deaths;
          participantToBeSaved.assists = participant.stats.spell1Id;
          participantToBeSaved.largestKillingSpree =
            participant.stats.largestKillingSpree;
          participantToBeSaved.largestMultiKill =
            participant.stats.largestMultiKill;
          participantToBeSaved.killingSprees =
            participant.stats.killingSprees;
          participantToBeSaved.longestTimeSpentLiving =
            participant.stats.longestTimeSpentLiving;
          participantToBeSaved.doubleKills =
            participant.stats.doubleKills;
          participantToBeSaved.tripleKills =
            participant.stats.tripleKills;
          participantToBeSaved.quadraKills =
            participant.stats.quadraKills;
          participantToBeSaved.pentaKills =
            participant.stats.pentaKills;
          participantToBeSaved.unrealKills =
            participant.stats.unrealKills;
          participantToBeSaved.totalDamageDealt =
            participant.stats.totalDamageDealt;
          participantToBeSaved.magicDamageDealt =
            participant.stats.magicDamageDealt;
          participantToBeSaved.physicalDamageDealt =
            participant.stats.physicalDamageDealt;
          participantToBeSaved.trueDamageDealt =
            participant.stats.trueDamageDealt;
          participantToBeSaved.largestCriticalStrike =
            participant.stats.largestCriticalStrike;
          participantToBeSaved.totalDamageDealtToChampions =
            participant.stats.totalDamageDealtToChampions;
          participantToBeSaved.magicDamageDealtToChampions =
            participant.stats.magicDamageDealtToChampions;
          participantToBeSaved.physicalDamageDealtToChampions =
            participant.stats.physicalDamageDealtToChampions;
          participantToBeSaved.trueDamageDealtToChampions =
            participant.stats.trueDamageDealtToChampions;
          participantToBeSaved.totalHeal =
            participant.stats.totalHeal;
          participantToBeSaved.totalUnitsHealed =
            participant.stats.totalUnitsHealed;
          participantToBeSaved.damageSelfMitigated =
            participant.stats.damageSelfMitigated;
          participantToBeSaved.damageDealtToObjectives =
            participant.stats.damageDealtToObjectives;
          participantToBeSaved.damageDealtToTurrets =
            participant.stats.damageDealtToTurrets;
          participantToBeSaved.visionScore =
            participant.stats.visionScore;
          participantToBeSaved.timeCCingOthers =
            participant.stats.timeCCingOthers;
          participantToBeSaved.totalDamageTaken =
            participant.stats.totalDamageTaken;
          participantToBeSaved.magicalDamageTaken =
            participant.stats.magicalDamageTaken;
          participantToBeSaved.physicalDamageTaken =
            participant.stats.physicalDamageTaken;
          participantToBeSaved.trueDamageTaken =
            participant.stats.trueDamageTaken;
          participantToBeSaved.goldEarned =
            participant.stats.goldEarned;
          participantToBeSaved.goldSpent =
            participant.stats.goldSpent;
          participantToBeSaved.turretKills =
            participant.stats.turretKills;
          participantToBeSaved.inhibitorKills =
            participant.stats.inhibitorKills;
          participantToBeSaved.totalMinionsKilled =
            participant.stats.totalMinionsKilled;
          participantToBeSaved.neutralMinionsKilled =
            participant.stats.neutralMinionsKilled;
          participantToBeSaved.neutralMinionsKilledTeamJungle =
            participant.stats.neutralMinionsKilledTeamJungle;
          participantToBeSaved.neutralMinionsKilledEnemyJungle =
            participant.stats.neutralMinionsKilledEnemyJungle;
          participantToBeSaved.totalTimeCrowdControlDealt =
            participant.stats.totalTimeCrowdControlDealt;
          participantToBeSaved.champLevel =
            participant.stats.champLevel;
          participantToBeSaved.visionWardsBoughtInGame =
            participant.stats.visionWardsBoughtInGame;
          participantToBeSaved.sightWardsBoughtInGame =
            participant.stats.sightWardsBoughtInGame;
          participantToBeSaved.wardsPlaced =
            participant.stats.wardsPlaced;
          participantToBeSaved.wardsKilled =
            participant.stats.wardsKilled;
          participantToBeSaved.firstBloodKill =
            participant.stats.firstBloodKill;
          participantToBeSaved.firstBloodAssist =
            participant.stats.firstBloodAssist;
          participantToBeSaved.firstTowerKill =
            participant.stats.firstTowerKill;
          participantToBeSaved.firstTowerAssist =
            participant.stats.firstTowerAssist;
          participantToBeSaved.firstInhibitorKill =
            participant.stats.firstInhibitorKill;
          participantToBeSaved.firstInhibitorAssist =
            participant.stats.firstInhibitorAssist;
          participantToBeSaved.perk0 = {
            perkType: participant.stats.perk0,
            perkStats1: participant.stats.perk0Var1,
            perkStats2: participant.stats.perk0Var2,
            perkStats3: participant.stats.perk0Var3,
          };
          participantToBeSaved.perk1 = {
            perkType: participant.stats.perk1,
            perkStats1: participant.stats.perk1Var1,
            perkStats2: participant.stats.perk1Var2,
            perkStats3: participant.stats.perk1Var3,
          };
          participantToBeSaved.perk2 = {
            perkType: participant.stats.perk2,
            perkStats1: participant.stats.perk2Var1,
            perkStats2: participant.stats.perk2Var2,
            perkStats3: participant.stats.perk2Var3,
          };
          participantToBeSaved.perk3 = {
            perkType: participant.stats.perk3,
            perkStats1: participant.stats.perk3Var1,
            perkStats2: participant.stats.perk3Var2,
            perkStats3: participant.stats.perk3Var3,
          };
          participantToBeSaved.perk4 = {
            perkType: participant.stats.perk4,
            perkStats1: participant.stats.perk4Var1,
            perkStats2: participant.stats.perk4Var2,
            perkStats3: participant.stats.perk4Var3,
          };
          participantToBeSaved.perk5 = {
            perkType: participant.stats.perk5,
            perkStats1: participant.stats.perk5Var1,
            perkStats2: participant.stats.perk5Var2,
            perkStats3: participant.stats.perk5Var3,
          };
          participantToBeSaved.perkPrimaryStyle =
            participant.stats.perkPrimaryStyle;
          participantToBeSaved.perkSubStyle =
            participant.stats.perkSubStyle;
          participantToBeSaved.statPerk0 =
            participant.stats.statPerk0;
          participantToBeSaved.statPerk1 =
            participant.stats.statPerk1;
          participantToBeSaved.statPerk2 =
            participant.stats.statPerk2;
          participantToBeSaved.creepsPerMinDeltas =
            participant.timeline.creepsPerMinDeltas;
          participantToBeSaved.xpPerMinDeltas =
            participant.timeline.xpPerMinDeltas;
          participantToBeSaved.goldPerMinDeltas =
            participant.timeline.goldPerMinDeltas;
          participantToBeSaved.csDiffPerMinDeltas =
            participant.timeline.csDiffPerMinDeltas;
          participantToBeSaved.xpDiffPerMinDeltas =
            participant.timeline.xpDiffPerMinDeltas;
          participantToBeSaved.damageTakenPerMinDeltas =
            participant.timeline.damageTakenPerMinDeltas;
          participantToBeSaved.damageTakenDiffPerMinDeltas =
            participant.timeline.damageTakenDiffPerMinDeltas;

          participantsToBeSaved.push(participantToBeSaved);
        } else {
          console.log("Participant-Object already exists!");
        }
      }
    }
  }
  /* participantIdentities.forEach((identity) => {
    participants.forEach((participant) => {
      
    });
  }); */
  Participant.insertMany(participantsToBeSaved);
}

async function saveMatches(matchList) {
  matchesToBeSaved = [];
  var getMatches = matchList.map((tempor) => {
    return apiService.match(tempor.gameId).catch((err) => {
      console.log(err);
    });
  });
  var matches = await Promise.all(getMatches);

  matches.forEach((temporaryMatch) => {
    let matchToBeSaved = new Match();
    matchToBeSaved.matchId = temporaryMatch.gameId;
    matchToBeSaved.serverId = temporaryMatch.platformId;
    matchToBeSaved.type = temporaryMatch.gameType;
    matchToBeSaved.mode = temporaryMatch.gameMode;
    matchToBeSaved.mapId = temporaryMatch.mapId;
    matchToBeSaved.duration = temporaryMatch.gameDuration;
    matchToBeSaved.matchDate = new Date(temporaryMatch.gameCreation);
    // patch
    let temporaryPatch = temporaryMatch.gameVersion.split(".");
    matchToBeSaved.patch =
      temporaryPatch[0] + "." + temporaryPatch[1];

    // participants
    temporaryMatch.participantIdentities.forEach((identity) => {
      matchToBeSaved.participants.push(identity.player.summonerId);
    });
    saveParticipants(
      temporaryMatch.participantIdentities,
      temporaryMatch.participants,
      temporaryMatch.gameId,
    );
    //teams
    temporaryMatch.teams.forEach((temporaryTeam) => {
      let temporaryWin;
      if (temporaryTeam.win === "Win") {
        temporaryWin = true;
      } else {
        temporaryWin = false;
      }
      let teamToBeSaved = {
        teamId: temporaryTeam.teamId,
        win: temporaryWin,
        firstBlood: temporaryTeam.firstBlood,
        firstTower: temporaryTeam.firstTower,
        firstInhibitor: temporaryTeam.firstInhibitor,
        firstBaron: temporaryTeam.firstBaron,
        firstDragon: temporaryTeam.firstDragon,
        firstRiftHerald: temporaryTeam.firstRiftHerald,
        towerKills: temporaryTeam.towerKills,
        inhibitorKills: temporaryTeam.inhibitorKills,
        baronKills: temporaryTeam.baronKills,
        dragonKills: temporaryTeam.dragonKills,
        vilemawKills: temporaryTeam.vilemawKills,
        riftHeraldKills: temporaryTeam.riftHeraldKills,
        bans: [],
      };

      temporaryTeam.bans.forEach((bansToBeSaved) => {
        teamToBeSaved.bans.push(bansToBeSaved);
      });
      matchToBeSaved.teams.push(teamToBeSaved);
    });
    console.log(matchToBeSaved);
    matchesToBeSaved.push(matchToBeSaved);
  });
  Match.insertMany(matchesToBeSaved);
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
