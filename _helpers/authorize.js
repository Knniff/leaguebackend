const expressJwt = require("express-jwt");
const config = require("../config");
const ErrorHelper = require("./error-helper");

function authorize(roles = []) {
  // roles param can be a single role string (e.g. Role.User or 'User')
  // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
  if (typeof roles === "string") {
    // eslint-disable-next-line no-param-reassign
    roles = [roles];
  }

  return [
    // authenticate JWT token and attach user to request object (req.user)
    expressJwt({ secret: config.secret }),

    // authorize based on user role
    // eslint-disable-next-line consistent-return
    (req, res, next) => {
      if (roles.length && !roles.includes(req.user.role)) {
        // user's role not authorized
        throw new ErrorHelper(
          "Unauthorized",
          401,
          "You dont have a role with the required Permissions for this.",
        );
      }

      // authorization and authentication succesful
      next();
    },
  ];
}

module.exports = authorize;
