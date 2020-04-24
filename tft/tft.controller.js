const express = require("express");
const { checkToken, validate } = require("../_helpers/validator");
const tftService = require("./tft.service");
const authorize = require("../_helpers/authorize");
const ErrorHelper = require("../_helpers/error-helper");

const router = express.Router();

/*
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                First Look at the routes at the bottom!

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

//Summoner
/* 
here  the function call tftService.summoner is a Promise. A Promise will first give back a Promise which then after the 
underlying logic (like an api-call or a database operation) gets resolved. If no error occured .then gets called else the .catch gets the error message.
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

In the .then and .catch arrow functions are used: https://www.sitepoint.com/es6-arrow-functions-new-fat-concise-syntax-javascript/


function example(req, res, next) {           gets called by a route at the bottom. in req there are parameters like the body or params. https://expressjs.com/de/api.html#req
  tftService                             calls a function in another file: look at the top which file is used 
    .summoner(req.params.id)                 id is in the example case at the bottom: peter. and is now given into the next function
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
 */

//working example
function summonerById(req, res, next) {
  tftService
    .summoner(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
function summonerById(req, res, next) {
  tftService
    .summoner(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
//Routes
/* 
Example:

router.get(
  "/example/:name",   :name is a variable in the url like: localhost:4000/example/peter       peter would be the name
  checkToken(),       
  validate,           checkToken and validate work together and are imported from from: ../_helpers/validator look there for further info
  authorize(),        authorize checks the validity of the jwt token, they are generate in when logging in in the user route and can identify an account
  example,     finally calls a function and passes thorugh other parameters like the body or params in: req
); 

*/
function challenger(req, res, next) {
  tftService
    .challenger(req.params.server)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function getMatchlist(req, res, next) {
  tftService
    .getMatchList(
      req.params.summonerId,
      req.query.server,
      req.query.serverRegion,
    )
    .then((data) => res.json(data))
    .catch((err) => next(err));
}

function match(req, res, next) {
  tftService
    .match(req.params.matchId)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
function winner(req, res, next) {
  tftService
    .winner(req.params.matchId)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
function calculateMeta(req, res, next) {
  tftService
    .calculateMeta(req.params.serverId, req.query.serverRegion)
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
function winrateByPet(req, res, next) {
  tftService
    .winrateByPet()
    .then((data) => res.json(data))
    .catch((err) => next(err));
}
router.get(
  "/summoner/id/:id",
  checkToken(),
  validate,
  authorize(),
  summonerById,
);
router.get("/challenger/:server", challenger);

router.get("/test/:summonerId", getMatchlist);

router.get("/match/:matchId", match);

router.get("/winner/:matchId", winner);
router.get("/update/meta/:serverId", calculateMeta);

router.get("/wpet", winrateByPet);

module.exports = router;

/* Plan for TFT Meta:
  - request the challenger ladder from riot-api (maybe later make it a choice which league to use, for comparing metas between divisions)
  - pick ONLY the summonername of the entrieslist
    !!!REPEAT FOR EACH INDIVUAL!!!
    - check their profile through tft-summoner in the riot-api
    - pick ONLY their puuid
    - use puuid to check for matchid though tft-match in the riot api
      !!!REPEAT FOR EACH INDIVUAL!!!
      - use the matchid to look up the match through tft-match in the riot api
      - scan the data for the 4 last-kicked and pick up their comb (maybe later champions used aswell)
      - upload into our db
  - from our own db rank these combs by win-percentage and popularity
  Ideas for later
    - add things surrounding items and meta/winrate
      - popular itembuilds on particular champs etc.
*/
