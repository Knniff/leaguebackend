const log = require("./logger");
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // default error
  if (err.name === "UnauthorizedError") {
    err.statusCode = 422;
    err.name = "Unauthorized.";
    if (err.message === "jwt malformed") {
      err.message = "JWT malformed.";
    }
  }
  if (err.statusCode === undefined) {
    err.statusCode = 500;
  }
  log.logger.warn(err.message);
  return res
    .status(err.statusCode)
    .json({ Error: err.name, message: err.message });
}

module.exports = errorHandler;
