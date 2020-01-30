// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  /*
  if (err.name === "CastError") {
    // mongoose validation error
    console.log("moongose: " + err.message + ",  Name: " + err.name);
    return res.status(404).json({
      Error: "Not Found",
      message: "Wrong ID or User deleted.",
    });
  }
  */
  // default error
  console.log(
    "Default: " +
      JSON.stringify(err.message) +
      ",  Name: " +
      err.name,
  );
  console.log("Stack:");
  console.log(err.stack);
  return res
    .status(err.statusCode)
    .json({ Error: err.name, message: err.message });
}

module.exports = errorHandler;
