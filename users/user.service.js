const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const qrcode = require("qrcode");
const db = require("../_helpers/db");
const Role = require("../_helpers/role");
const ErrorHelper = require("../_helpers/error-helper");
const mfa = require("../_helpers/mfa");

const { User } = db;
const refreshTokens = [];
// const blacklistedRefreshTokens = [];

async function login({ username, password }) {
  const user = await User.findOne({ username });
  if (user && bcrypt.compareSync(password, user.hash)) {
    if (user.mfaEnabled) {
      const refreshToken = jwt.sign(
        {
          sub: user.id,
          role: user.role,
        },
        process.env.REFRESHTOKENSECRET,
      );
      return { refreshToken };
    }
    const accessToken = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.ACCESSTOKENSECRET,
      { expiresIn: "25m" },
    );
    const refreshToken = jwt.sign(
      {
        sub: user.id,
        role: user.role,
      },
      process.env.REFRESHTOKENSECRET,
    );
    refreshTokens.push(refreshToken);
    const {
      hash,
      mfaSecret,
      ...userWithoutSecrets
    } = user.toObject();
    return {
      ...userWithoutSecrets,
      accessToken,
      refreshToken,
    };
  }
  throw new ErrorHelper(
    "Unauthorized",
    401,
    "Username or Password is incorrect.",
  );
}

async function verifyMfaToken(refreshToken, totp) {
  if (refreshTokens.includes(refreshToken)) {
    throw new ErrorHelper("Not Needed", 200, "Already Logged in.");
  }
  const tokenData = jwt.verify(
    refreshToken,
    process.env.REFRESHTOKENSECRET,
    (err, data) => {
      if (err) {
        throw new ErrorHelper(
          "Unauthorized",
          401,
          "The refresh token is invalid.",
        );
      }
      return {
        data,
      };
    },
  );
  const user = await User.findById(tokenData.data.sub);
  const authenticated = mfa.verifyTOTP(
    totp,
    user.mfaSecret,
    process.env.MFAWINDOW,
  );
  if (authenticated) {
    refreshTokens.push(refreshToken);
    const accessToken = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.ACCESSTOKENSECRET,
      { expiresIn: "25m" },
    );
    const {
      hash,
      mfaSecret,
      ...userWithoutSecrets
    } = user.toObject();
    return { ...userWithoutSecrets, accessToken, refreshToken };
  }
  throw new ErrorHelper(
    "Unauthorized",
    401,
    "TOTP Token is incorrect.",
  );
}

async function generateMfa(id) {
  const user = await User.findById(id);
  const userSecret = mfa.generateSecret(process.env.MFASECRETLENGTH);
  user.mfaSecret = userSecret;
  const otpauthurl = `otpauth://totp/LoginBackend:${user.username}?secret=${userSecret}`;
  const dataurl = await qrcode.toDataURL(otpauthurl);
  await user.save();
  return { userSecret, dataurl };
}

async function enableMfa(id, totp) {
  const user = await User.findById(id);
  const authenticated = mfa.verifyTOTP(
    totp,
    user.mfaSecret,
    process.env.MFAWINDOW,
  );
  if (authenticated) {
    user.mfaEnabled = true;
    return user.save();
  }
  user.mfaSecret = "";
  throw new ErrorHelper(
    "Unauthorized",
    401,
    "TOTP Token is incorrect. Mfa Activation process exited.",
  );
}

async function disableMfa(id) {
  const user = await User.findById(id);
  user.mfaSecret = "";
  user.mfaEnabled = false;
  return user.save();
}

async function logout(refreshToken) {
  const index = refreshTokens.findIndex(
    (element) => element === refreshToken,
  );
  if (index === -1) {
    throw new ErrorHelper(
      "Unauthorized",
      401,
      "The refresh token is invalid.",
    );
  }
  refreshTokens.splice(index, 1);
}

async function tokenRefresh(refreshToken) {
  if (!refreshTokens.includes(refreshToken)) {
    throw new ErrorHelper(
      "Unauthorized",
      401,
      "The refresh token is invalid.",
    );
  }

  const tokens = jwt.verify(
    refreshToken,
    process.env.REFRESHTOKENSECRET,
    (err, user) => {
      if (err) {
        throw new ErrorHelper(
          "Unauthorized",
          401,
          "The refresh token is invalid.",
        );
      }

      const accessToken = jwt.sign(
        { sub: user.sub, role: user.role },
        process.env.ACCESSTOKENSECRET,
        { expiresIn: "25m" },
      );

      return {
        accessToken,
        refreshToken,
      };
    },
  );
  return tokens;
}

async function getAll() {
  return User.find().select("-hash");
}

async function getById(id) {
  const user = await User.findById(id).select("-hash");
  if (user) {
    return user;
  }
  throw new ErrorHelper(
    "Not Found",
    404,
    "Wrong ID or User deleted.",
  );
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
  if (!("role" in userParam)) {
    user.role = JSON.stringify(Role.User);
  }
  if (userParam.password) {
    user.hash = bcrypt.hashSync(userParam.password, 10);
  }
  return user.save();
}

async function update(id, userParam) {
  const user = await User.findById(id);
  // validate
  if (user.username !== userParam.username) {
    if (await User.findOne({ username: userParam.username })) {
      throw new ErrorHelper(
        "Not Unique",
        500,
        `Username ${userParam.username} is already taken`,
      );
    }
  }
  // hash password
  user.hash = bcrypt.hashSync(userParam.password, 10);

  // copy userParam properties to user
  Object.assign(user, userParam);
  return user.save();
}

async function deleter(id) {
  const user = await User.findByIdAndDelete(id);
  console.log(user);
  return user;
}

module.exports = {
  login,
  verifyMfaToken,
  generateMfa,
  enableMfa,
  disableMfa,
  logout,
  tokenRefresh,
  getAll,
  getById,
  create,
  update,
  delete: deleter,
};
