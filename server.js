//instantiating the core packages
//server package
const express = require("express");
//additional server helpers
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
//selfbuilt error handler
const errorHandler = require("./_helpers/error-handler");
//custom logger
const log = require("./_helpers/logger");

//bind the server package to the variable: app
const app = express();
//activates debug statements for troubleshooting
//app.use(log.expressLogger);
//integrate the helpers into the server
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//specific rootes: see the named file
app.use("/users", require("./users/users.controller"));
app.use("/league", require("./league/league.controller"));
app.use("/tft", require("./tft/tft.controller"));

app.use(errorHandler);

// start server
// eslint-disable-next-line no-unused-vars
const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});

module.exports = server;
