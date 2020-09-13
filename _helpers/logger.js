const pino = require("pino");
// const pinoElastic = require("pino-elasticsearch");
const expressPino = require("express-pino-logger");

/* const streamToElastic = pinoElastic({
  index: "an-index",
  type: "log",
  consistency: "one",
  node: "http://localhost:9200",
  "es-version": 6,
  "bulk-size": 200,
  ecs: true,
}); */

const logger = pino({ level: "info", prettyPrint: true });
// const logger = pino({ level: "info" }, streamToElastic);

const expressLogger = expressPino({ logger });

module.exports.expressLogger = expressLogger;
module.exports.logger = logger;
