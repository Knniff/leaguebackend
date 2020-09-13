const jwt = require("jsonwebtoken");
const ErrorHelper = require("./error-helper");
const userService = require("../users/user.service");
// const Role = require("./role");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.ACCESSTOKENSECRET,
      (error, user) => {
        if (error) {
          if (error.name === "TokenExpiredError") {
            throw new ErrorHelper(
              "TokenExpiredError",
              401,
              `The token used is expired: ${error.expiredAt}, you can refresh it at "/token".`,
            );
          } else {
            throw new ErrorHelper(
              "Unauthorized",
              401,
              "The token is invalid.",
            );
          }
        }
        userService.getById(user.sub).catch((err) => next(err));
        req.user = user;
        next();
      },
    );
  }
};

function authorize(requiredrank = 0) {
  return function authorizer(req, res, next) {
    const userrole = JSON.parse(req.user.role);
    if (userrole.rank >= requiredrank) {
      return next();
    }
    throw new ErrorHelper(
      "Unauthorized",
      401,
      "You dont have a role with the required Permissions for this.",
    );
  };
}

module.exports = {
  authorize,
  authenticate,
};
