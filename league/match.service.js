// apiService uses a package to call the official riot api
const apiService = require("../_helpers/api.service");
const ErrorHelper = require("../_helpers/error-helper");
//instantiating the database: look at the database file for more info
const db = require("../_helpers/db");
// loads the Models
const { Match, Participant, Summoner, Event, Frame } = db;

//Make Promise based response
// no Batchoperations for different games
//API requests in right before the data is needed
//save participants, events, frames and match simultaneously

async function saveParticipants(
  participantIdentities,
  participants,
  matchId,
) {
  let participantsToBeSaved = [];
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
          participantToBeSaved.duplicateCheck =
            identity.player.summonerId + "|" + matchId;
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
          //console.log(participantToBeSaved);
          participantsToBeSaved.push(participantToBeSaved);
        } else {
          //console.log("Participant-Object already exists!");
        }
      }
    }
  }
  try {
    Participant.insertMany(participantsToBeSaved, { ordered: false });
  } catch (error) {
    console.log(error);
  }
}

async function saveTimelineData(participantIdentities, matchId) {
  const timeline = await apiService.matchtimeline(matchId);
  let participants = {};
  participantIdentities.forEach((identity) => {
    participants[identity.participantId] = identity.player.summonerId;
  });
  let frames = [];
  let events = [];
  timeline.frames.forEach((dataFrame) => {
    const values = Object.values(dataFrame.participantFrames);
    values.forEach((frame) => {
      frame.participantId = participants[frame.participantId];
      frame.matchId = matchId;
      frame.timestamp = dataFrame.timestamp;
      const frameToBeSaved = new Frame(frame);
      frames.push(frameToBeSaved);
    });

    dataFrame.events.forEach((event) => {
      event.matchId = matchId;
      if ("participantId" in event) {
        event.participantId = participants[event.participantId];
      }
      if ("creatorId" in event) {
        event.creatorId = participants[event.creatorId];
      }
      if ("killerId" in event) {
        event.killerId = participants[event.killerId];
      }
      if ("victimId" in event) {
        event.victimId = participants[event.victimId];
      }
      if ("assistingParticipantIds" in event) {
        for (
          let index = 0;
          index < event.assistingParticipantIds.length;
          index++
        ) {
          event.assistingParticipantIds[index] =
            participants[event.assistingParticipantIds[index]];
        }
      }
      const eventToBeSaved = new Event(event);
      events.push(eventToBeSaved);
    });
  });
  try {
    Frame.insertMany(frames, { ordered: false });
  } catch (error) {
    console.log(error);
  }
  try {
    Event.insertMany(events, { ordered: false });
  } catch (error) {
    console.log(error);
  }
}

async function saveMatch(match) {
  saveTimelineData(match.participantIdentities, match.gameId);
  let matchToBeSaved = new Match();
  matchToBeSaved.matchId = match.gameId;
  matchToBeSaved.serverId = match.platformId;
  matchToBeSaved.type = match.gameType;
  matchToBeSaved.mode = match.gameMode;
  matchToBeSaved.mapId = match.mapId;
  matchToBeSaved.duration = match.gameDuration;
  matchToBeSaved.matchDate = new Date(match.gameCreation);
  // patch
  let temporaryPatch = match.gameVersion.split(".");
  matchToBeSaved.patch = temporaryPatch[0] + "." + temporaryPatch[1];

  // participants
  match.participantIdentities.forEach((identity) => {
    matchToBeSaved.participants.push(identity.player.summonerId);
  });
  saveParticipants(
    match.participantIdentities,
    match.participants,
    match.gameId,
  );
  //teams
  match.teams.forEach((temporaryTeam) => {
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
    if (temporaryTeam.teamId === 100) {
      matchToBeSaved.teams.blue = teamToBeSaved;
    } else {
      matchToBeSaved.teams.red = teamToBeSaved;
    }
  });
  console.log(matchToBeSaved);
  return matchToBeSaved;
}

async function saveBatchMatches(matchList) {
  let matchesToBeSaved = [];
  var getMatches = matchList.map((tempor) => {
    return apiService.match(tempor.gameId).catch((err) => {
      console.log(err);
    });
  });
  var matches = await Promise.all(getMatches);

  matches.forEach((temporaryMatch) => {
    matchesToBeSaved.push(saveMatch(temporaryMatch));
  });
  console.log(matchesToBeSaved);
  var matchess = await Promise.all(matchesToBeSaved);
  try {
    Match.insertMany(matchess, { ordered: false });
  } catch (error) {
    console.log(error);
  }
}

async function allMatches(summonerId) {
  var summoner = await Summoner.findOne({ summonerId: summonerId });
  const apiMatchlist = await apiService
    .matchlist(summoner.accountId)
    .catch((err) => {
      throw err;
    });

  var newMatches = [];
  for (let index = 0; index < apiMatchlist.length; index++) {
    let match = await Match.findOne({
      matchId: apiMatchlist[index].matchId,
    });
    if (match === null) {
      newMatches.push(apiMatchlist[index]);
    }
  }

  if (!newMatches.length) {
    return "No new Matches";
  }

  for (let index = 0; index < newMatches.length; index = index + 10) {
    let temp = [];
    temp = newMatches.slice(index, index + 10);
    saveBatchMatches(temp);
  }
  return "Processing " + newMatches.length + " Matche(s).";
}

module.exports = {
  allMatches,
};
