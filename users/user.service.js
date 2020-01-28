const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const db = require("../_helpers/db");

const { User } = db;

// eslint-disable-next-line consistent-return
async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
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
        throw new Error(`Username "${userParam.username}" is already taken`);
    }
    console.log("found no duplicate");

    const user = new User(userParam);
    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }
    console.log("hashed pw");
    // copy userParam properties to user
    // Object.assign(user, userParam);

    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);
    // validate
    if (!user) throw new Error("User not found");
    if (user.username !== userParam.username) {
        if (await User.findOne({ username: userParam.username })) {
            throw new Error(`Username "${userParam.username}" is already taken`);
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
