const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./_helpers/error-handler");
const log = require("./_helpers/logger");

const app = express();
app.use(log.expressLogger);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use("/users", require("./users/users.controller"));

app.use(errorHandler);

// start server
// eslint-disable-next-line no-unused-vars
const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
