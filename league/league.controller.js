const express = require("express");
const { checkToken, validate } = require("../_helpers/validator");
const masteryService = require("./mastery.service");
const matchService = require("./match.service");
const apiService = require("../_helpers/api.service");
const authorize = require("../_helpers/authorize");
const ErrorHelper = require("../_helpers/error-helper");

const router = express.Router();
// BASIC
//get Summoner by Name and return

//add or update Summoner and Ranked Stats by SummonerID

//add or update Mastery, Matches and Timelines and calculate Stats marked with "*" by SummonerID

//MATCH STATS
//EVENT AND FRAMES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//get Matchdata with inbuilt Pagination by SummonerID

//get Match, Participants and Timeline by MatchID

//get Matchdata(alltime data or averages over the last 10, 50 or all games)(by different queue) by SummonerID*

//get Participant(alltime data or averages over the last 10, 50 or all games)(by different queue) Stats by SummonerID*

//get Roledata(alltime data or averages over the last 10, 50 or all games)(by different queue) by SummonerID*

//CHAMPION STATS
//get Participant(alltime data or averages over the last 10, 50 or all games)(by different queue) Stats for a specific Champion by SummonerID*

//get Mastery(alltime data) Stats for a specific Champion by SummonerID*

//for queue distinction
//const list = require( "queue.json" );

//LEAGUE
//get Ranked Stats and overview of current League

//get current Challenger League

//find a Summoner by Id. then either update his data and mastery or add
function summonerById(req, res, next) {
  masteryService
    .summoner(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
function summonerByName(req, res, next) {
  apiService
    .summonerByName(req.params.name)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
//Mastery
//get all mastery with built in pagination
function mastery(req, res, next) {
  masteryService
    .mastery(req.query.next, req.query.limit)
    .then((data) =>
      data
        ? res.json(data)
        : next(
            new ErrorHelper(
              "Not Found",
              404,
              "No more data or wrong next key.",
            ),
          ),
    )
    .catch((err) => next(err));
}

//get all mastery from a specific champion with built in pagination
function championMastery(req, res, next) {
  masteryService
    .championMastery(req.query.next, req.query.limit, req.params.id)
    .then((data) =>
      data
        ? res.json(data)
        : next(
            new ErrorHelper(
              "Not Found",
              404,
              "No more data or wrong next key.",
            ),
          ),
    )
    .catch((err) => next(err));
}

//get all mastery from a specific summoner with built in pagination
function summonerMastery(req, res, next) {
  masteryService
    .summonerMastery(req.query.next, req.query.limit, req.params.id)
    .then((data) =>
      data
        ? res.json(data)
        : next(
            new ErrorHelper(
              "Not Found",
              404,
              "Wrong ID or no User found.",
            ),
          ),
    );
}

//update the masteries from a specific summoner
function updateSummonerMastery(req, res, next) {
  masteryService
    .updateMastery(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

//get stats about all/champion/summoner masteries
function masteryStats(req, res, next) {
  masteryService
    .masteryStats(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
// match
//currently no real backend just putting data through from the riot api
function match(req, res, next) {
  apiService
    .match(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function matchlist(req, res, next) {
  apiService
    .matchlist(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function matchtimeline(req, res, next) {
  apiService
    .matchtimeline(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function allmatches(req, res, next) {
  matchService
    .allMatches(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
//Summoner
router.get(
  "/summoner/name/:name",
  checkToken(),
  validate,
  authorize(),
  summonerByName,
);

router.get(
  "/summoner/id/:id",
  checkToken(),
  validate,
  authorize(),
  summonerById,
);
//Mastery
router.get("/mastery", checkToken(), validate, authorize(), mastery);

router.get(
  "/mastery/summoner/:id",
  checkToken(),
  validate,
  authorize(),
  summonerMastery,
);
router.get(
  "/mastery/champion/:id",
  checkToken(),
  validate,
  authorize(),
  championMastery,
);

router.put(
  "/mastery/update/:id",
  checkToken(),
  validate,
  authorize(),
  updateSummonerMastery,
);

router.get(
  "/mastery/stats/:id",
  checkToken(),
  validate,
  authorize(),
  masteryStats,
);
// match
router.get("/match/:id", checkToken(), validate, authorize(), match);

router.get(
  "/allmatches/:id",
  checkToken(),
  validate,
  authorize(),
  allmatches,
);

router.get(
  "/matchlist/:id",
  checkToken(),
  validate,
  authorize(),
  matchlist,
);

router.get(
  "/matchtimeline/:id",
  checkToken(),
  validate,
  authorize(),
  matchtimeline,
);

module.exports = router;
