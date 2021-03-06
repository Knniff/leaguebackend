const log = require("./logger");
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // default error
  if (err.statusCode === undefined) {
    err.statusCode = 500;
  }
  log.logger.warn(err.message);
  return res
    .status(err.statusCode)
    .json({ Error: err.name, message: err.message });
}

module.exports = errorHandler;
