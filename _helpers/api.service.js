const TeemoJS = require("teemojs");
let api = TeemoJS(process.env.RGAPI);
const ErrorHelper = require("./error-helper");

// using a package the Riot-API is called
//https://github.com/MingweiSamuel/TeemoJS
async function summonerById(summonerId, serverId) {
  const data = api
    .get(serverId, "summoner.getBySummonerId", summonerId)
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

async function summonerBypuuId(puuId, serverId) {
  const data = api
    .get(serverId, "summoner.getByPUUID", puuId)
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

async function matchlist(accountId) {
  const data = await api.get("euw1", "match.getMatchlist", accountId);
  return data;
}

async function matchtimeline(matchId) {
  const data = await api.get(
    "euw1",
    "match.getMatchTimeline",
    matchId,
  );
  return data;
}

async function tft_challenger(server) {
  const data = await api.get(server, "tftLeague.getChallengerLeague");
  return data;
}

async function tft_MatchlistFromPuuid(puuid, server) {
  const data = await api.get(
    server,
    "tftMatch.getMatchIdsByPUUID",
    puuid,
    { count: 20 },
  );
  return data;
}

async function tft_Match(matchId) {
  const toCheck = matchId.split("_")[0];
  var serverRegion;
  switch (toCheck) {
    case "EUNE1":
    case "TR1":
    case "RU1":
    case "EUW1":
      serverRegion = "europe";
      break;
    case "NA1":
    case "LAN1":
    case "LAS1":
    case "OCE1":
    case "BR1":
      serverRegion = "americas";
      break;
    case "KR1":
    case "JP1":
      serverRegion = "asia";
      break;
  }
  const data = await api.get(
    serverRegion,
    "tftMatch.getMatch",
    matchId,
  );
  return data;
}

module.exports = {
  summonerById,
  summonerByName,
  summonerBypuuId,
  mastery,
  match,
  matchlist,
  matchtimeline,
  tft_challenger,
  tft_MatchlistFromPuuid,
  tft_Match,
};
