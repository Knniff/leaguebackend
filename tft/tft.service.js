const apiService = require("../_helpers/api.service");
const ErrorHelper = require("../_helpers/error-helper");

//instatiating the database: look at the database file for more info
const db = require("../_helpers/db");
// loads the Mastery and Summoner Model
const { Summoner } = db;

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
