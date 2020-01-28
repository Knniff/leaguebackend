const express = require("express");
const {
  loginValidationRules,
  registerValidationRules,
  updateValidationRules,
  checkId,
  validate,
} = require("../_helpers/validator");
const userService = require("./user.service");
const authorize = require("../_helpers/authorize");
const Role = require("../_helpers/role");

const router = express.Router();

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res
            .status(400)
            .json({ message: "Username or password is incorrect" }),
    )
    .catch(err => next(err));
}

function register(req, res, next) {
  console.log(req.body);
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
  const { id } = req.params;

  // only allow admins to acces other user records
  if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  userService
    .getById(req.params.id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch(err => next(err));
}

function deleter(req, res, next) {
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
router.get("/", authorize(Role.Admin), getAll); // admin only
router.get("/:id", checkId(), validate, authorize(), getById); // all authenticated users
router.put(
  "/:id",
  updateValidationRules(),
  validate,
  authorize(Role.Admin),
  update,
);
router.delete(
  "/:id",
  checkId(),
  validate,
  authorize(Role.Admin),
  deleter,
);

module.exports = router;
