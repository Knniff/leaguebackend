const express = require("express");
const { checkToken, validate } = require("../_helpers/validator");
const masteryService = require("./mastery.service");
const apiService = require("../_helpers/api.service");
const { authorize, authenticate } = require("../_helpers/authorize");
const ErrorHelper = require("../_helpers/error-helper");

const router = express.Router();

//find a Summoner by Id. then either update his data and mastery or add
function summonerById(req, res, next) {
  masteryService
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

function matchlist(req, res, next) {
  apiService
    .matchlist(req.params.id)
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

function matchtimeline(req, res, next) {
  apiService
    .matchtimeline(req.params.id)
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

//Summoner
router.get(
  "/summoner/name/:name",
  checkToken(),
  validate,
  authenticate,
  authorize(),
  summonerByName,
);

router.get(
  "/summoner/id/:id",
  checkToken(),
  validate,
  authenticate,
  authorize(),
  summonerById,
);
//Mastery
router.get(
  "/mastery",
  checkToken(),
  validate,
  authenticate,
  authorize(),
  mastery,
);

router.get(
  "/mastery/summoner/:id",
  checkToken(),
  validate,
  authenticate,
  authorize(),
  summonerMastery,
);
router.get(
  "/mastery/champion/:id",
  checkToken(),
  validate,
  authenticate,
  authorize(),
  championMastery,
);

router.put(
  "/mastery/update/:id",
  checkToken(),
  validate,
  authenticate,
  authorize(),
  updateSummonerMastery,
);

router.get(
  "/mastery/stats/:id",
  checkToken(),
  validate,
  authenticate,
  authorize(),
  masteryStats,
);

router.get(
  "/match/:id",
  checkToken(),
  validate,
  authenticate,
  authorize(),
  match,
);
router.get(
  "/matchlist/:id",
  checkToken(),
  validate,
  authenticate,
  authorize(),
  matchlist,
);

router.get(
  "/matchtimeline/:id",
  checkToken(),
  validate,
  authenticate,
  authorize(),
  matchtimeline,
);

module.exports = router;
