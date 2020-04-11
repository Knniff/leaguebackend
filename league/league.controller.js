const express = require("express");
const { checkToken, validate } = require("../_helpers/validator");
const leagueService = require("./league.service");
const apiService = require("./api.service");
const authorize = require("../_helpers/authorize");
const Role = require("../_helpers/role");
const ErrorHelper = require("../_helpers/error-helper");

const router = express.Router();

//Summoner
//find a Summoner by Id. then either update his data and mastery or add
function summonerById(req, res, next) {
  leagueService
    .summoner(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

//find a summoner by name and return
function summonerByName(req, res, next) {
  apiService
    .summonerByName(req.params.name)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

//Mastery
//
function mastery(req, res, next) {
  leagueService
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

function championMastery(req, res, next) {
  leagueService
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

function summonerMastery(req, res, next) {
  leagueService
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

function updateSummonerMastery(req, res, next) {
  leagueService
    .updateMastery(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function masteryStats(req, res, next) {
  leagueService
    .masteryStats(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
// match
/*
function match(req, res, next) {
  apiService
    .match(req.params.id)
    .then(data =>
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

function matchlist(req, res, next) {
  apiService
    .matchlist(req.params.id)
    .then(data =>
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

function matchtimeline(req, res, next) {
  apiService
    .matchtimeline(req.params.id)
    .then(data =>
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
*/
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

/*
router.get("/match/:id", checkToken(), validate, authorize(), match);
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
*/
module.exports = router;
