const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const db = require("../_helpers/db");
const ErrorHelper = require("../_helpers/error-helper");

const { User } = db;

// eslint-disable-next-line consistent-return
async function authenticate({ username, password }) {
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.hash)) {
    const token = jwt.sign(
      { sub: user.id, role: user.role },
      config.secret,
      { expiresIn: "20d" },
    );
    const { hash, ...userWithoutHash } = user.toObject();
    return {
      ...userWithoutHash,
      token,
    };
  }
}

async function getAll() {
  return User.find().select("-hash");
}

async function getById(id) {
  return User.findById(id).select("-hash");
}

async function create(userParam) {
  // look if username is free
  if (await User.findOne({ username: userParam.username })) {
    throw new ErrorHelper(
      "Not Unique",
      500,
      `Username ${userParam.username} is already taken`,
    );
  }

  const user = new User(userParam);
  // hash password
  user.role = "User";
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  await user.save();
}

async function update(id, userParam) {
  const user = await User.findById(id);
  // validate
  if (!user)
    throw new ErrorHelper(
      "Not Found",
      404,
      "Wrong ID or User deleted.",
    );
  if (user.username !== userParam.username) {
    if (await User.findOne({ username: userParam.username })) {
      throw new ErrorHelper(
        "Not Unique",
        500,
        `Username ${userParam.username} is already taken`,
      );
    }
  }

  // hash password if it was entered
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function deleter(id) {
  await User.findByIdAndDelete(id);
}

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: deleter,
};
