const apiService = require("../_helpers/api.service");
const ErrorHelper = require("../_helpers/error-helper");

//instatiating the database: look at the database file for more info
const db = require("../_helpers/db");
// loads the Mastery and Summoner Model
const { Summoner, TFT_MetaData } = db;

async function summoner(summonerId) {
  //find a summoner by their id in the database. if the "await" keyword would be missing then the funtion would fail because the next lines would try to read and write data that isnt there yet, because the Promise isnt resolved yet.
  const oldSummoner = await Summoner.findOne({
    summonerId: summonerId,
  });
  if (oldSummoner) {
    //manipulating the object
    oldSummoner.iconId = 3;
    //logging the object
    console.log(oldSummoner);
    //saving him back to the database: he can bes saved because in the object there is an id which identifies him
    oldSummoner.save();
    //returning him back to tft.controller
    return oldSummoner;
  } else {
    //getting data from the Riot API and saving it into data when it arrives. if the "await" keyword would be missing then the funtion would fail because the next lines would try to read and write data that isnt there yet, because the Promise isnt resolved yet.
    const data = await apiService
      .summonerById(summonerId)
      .catch((err) => {
        throw err;
      });
    // if the Riot api call fails it returns a error object and then a error is thrown which is catched in tft.controller
    if (data.status) {
      throw new ErrorHelper(
        "Internal Server Error",
        data.status.status_code,
        "Riot-API failure or wrong API-key.",
      );
    }
    // for the data to be saved to the database the object has to match the datastructure in the database which is different from the structure given back from the api so a new object is created from the Summoner Model and the data is transferred
    const summoner = new Summoner();
    summoner.summonerId = data.id;
    summoner.accountId = data.accountId;
    summoner.puuid = data.puuid;
    summoner.summonerName = data.name;
    summoner.summonerLevel = data.summonerLevel;
    summoner.iconId = data.profileIconId;
    summoner.serverId = "EUW";
    //the new summoner is saved to the database and he will be given an id and a creation date
    summoner.save();
    //returning him back to tft.controller
    return summoner;
  }
}

async function challenger(serverId) {
  const data = await apiService.tft_challenger(serverId);
  return data;
}

async function getMatchList(summonerId, serverId, serverRegion) {
  const data = await apiService.summonerById(summonerId, serverId);
  const puuid = data.puuid;
  const data2 = await apiService.tft_MatchlistFromPuuid(
    puuid,
    serverRegion,
  );
  console.log("Matchlistcount:" + data2.length);
  return data2;
}

async function match(matchId) {
  const data = await apiService.tft_Match(matchId);
  return data;
}

async function winner(matchId) {
  const checkMatchId = await TFT_MetaData.findOne({
    matchId: matchId,
  });
  if (checkMatchId) {
    console.log("Match already processed!");
    return;
  }
  const data = await match(matchId);
  data.info.participants.forEach((element) => {
    if (element.placement === 1) {
      let activeTraits = [];
      element.traits.forEach((i) => {
        if (i.tier_current !== 0) {
          activeTraits.push(i);
        }
      });

      let newMetaData = new TFT_MetaData();
      newMetaData.matchId = matchId;
      newMetaData.game_version = data.info.game_version;
      newMetaData.traits = activeTraits;
      newMetaData.units = element.units;
      newMetaData.companion = element.companion.species;

      newMetaData.save();
    }
  });
  console.log("Successfully added " + matchId);
  return;
}

async function calculateMeta(serverId, serverRegion) {
  const ladder = await challenger(serverId);
  const entries = ladder.entries;

  for (i = 0; i < entries.length; i++) {
    var test_count_test = 0;
    let summonerId = entries[i].summonerId;
    let matchList = await getMatchList(
      summonerId,
      serverId,
      serverRegion,
    );
    for (x = 0; x < matchList.length; x++) {
      winner(matchList[x]);
      test_count_test++;
    }
    console.log(test_count_test);
  }
  console.log("MetaDatas got updated!");
  return "Added new Data in metadatas";
} //später noch Elo

async function winrateByPet() {
  const data = await TFT_MetaData.find();
  var allPets = [];

  //put all companions inside the variable allPets
  data.forEach((element) => {
    allPets.push(element.companion);
  });

  //put each unique companion into a new array
  var uniquePets = allPets.filter(onlyUnique);
  var totalAmountOfEachPet = [];

  for (var i = 0; i < uniquePets.length; i++) {
    let lastIndex = 0;
    let count = 0;
    while (true) {
      lastIndex = allPets.indexOf(uniquePets[i], lastIndex + 1);
      if (lastIndex === -1) {
        break;
      }
      count++;
    }

    //now push all the values together so a structure forms. name, totalcount, winrate in %. Its possible to access the data with .indexOf(name) and a +1 for total count or +2 for percent
    totalAmountOfEachPet.push(uniquePets[i]);
    totalAmountOfEachPet.push(count);
    var percent = (count / allPets.length) * 100;
    totalAmountOfEachPet.push(percent.toPrecision(3));
  }
  console.log(allPets.length + " Little Legends tested!");
  return totalAmountOfEachPet;
}

//dont ask me how this works. its copied: https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

//export the function so it can be used/imported in tft controller
module.exports = {
  summoner,
  challenger,
  getMatchList,
  match,
  winner,
  calculateMeta,
  winrateByPet,
};
