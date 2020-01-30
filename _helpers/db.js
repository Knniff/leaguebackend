const mongoose = require("mongoose");
const config = require("../config");
const user = require("../users/user.model");
const log = require("./logger");

mongoose.set("debug", true);
mongoose
  .connect(config.connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      log.logger.info("Database is connected");
    },
    err => {
      log.logger.error(`Can not connect to the database${err}`);
    },
  );
mongoose.Promise = global.Promise;

module.exports = {
  User: user,
};
