const express = require("express");
const {
  loginValidationRules,
  registerValidationRules,
  updateValidationRules,
  checkId,
  checkToken,
  validate,
} = require("../_helpers/validator");
const userService = require("./user.service");
const authorize = require("../_helpers/authorize");
const Role = require("../_helpers/role");
const ErrorHelper = require("../_helpers/error-helper");

const router = express.Router();

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : next(
            new ErrorHelper(
              "Unauthorized",
              401,
              "Username or Password is incorrect.",
            ),
          ),
    )
    .catch(err => next(err));
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
}

// eslint-disable-next-line consistent-return
function getById(req, res, next) {
  const currentUser = req.user;

  // only allow admins to access other user records
  if (
    req.params.id !== currentUser.sub &&
    currentUser.role !== Role.Admin
  ) {
    throw new ErrorHelper(
      "Forbidden",
      403,
      "Forbidden for standard User, if its not your own account.",
    );
  }

  userService
    .getById(req.params.id)
    .then(user =>
      user
        ? res.json(user)
        : next(
            new ErrorHelper(
              "Not Found",
              404,
              "Wrong ID or User deleted.",
            ),
          ),
    )
    .catch(err => next(err));
}

function update(req, res, next) {
  const currentUser = req.user;

  // only allow admins to access other user records
  if (
    req.params.id !== currentUser.sub &&
    currentUser.role !== Role.Admin
  ) {
    throw new ErrorHelper(
      "Forbidden",
      403,
      "Forbidden for standard User, if its not your own account.",
    );
  }

  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function deleter(req, res, next) {
  const currentUser = req.user;

  // only allow admins to delete other user records
  if (
    req.params.id !== currentUser.sub &&
    currentUser.role !== Role.Admin
  ) {
    throw new ErrorHelper(
      "Forbidden",
      403,
      "Forbidden for standard User, if its not your own account.",
    );
  }

  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch(err => next(err));
}

// routes
router.post(
  "/authenticate",
  loginValidationRules(),
  validate,
  authenticate,
); // public routes
router.post(
  "/register",
  registerValidationRules(),
  validate,
  register,
);
router.get(
  "/",
  checkToken(),
  validate,
  authorize(Role.Admin),
  getAll,
); // admin only
router.get(
  "/:id",
  checkToken(),
  checkId(),
  validate,
  authorize(),
  getById,
); // all authenticated users
router.put(
  "/:id",
  checkToken(),
  updateValidationRules(),
  validate,
  authorize(),
  update,
);
router.delete(
  "/:id",
  checkToken(),
  checkId(),
  validate,
  authorize(),
  deleter,
);

module.exports = router;
