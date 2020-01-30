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
const port =
  process.env.NODE_ENV === "production"
    ? process.env.PORT || 80
    : 4000;
// eslint-disable-next-line no-unused-vars
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
