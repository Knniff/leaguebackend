const mongoose = require("mongoose");
const config = require("../config");
const user = require("../users/user.model");

mongoose.set("debug", true);
mongoose
  .connect(config.connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log("Database is connected");
    },
    err => {
      console.log(`Can not connect to the database${err}`);
    },
  );
mongoose.Promise = global.Promise;

module.exports = {
  User: user,
};
