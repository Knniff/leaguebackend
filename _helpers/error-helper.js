class ErrorHelper extends Error {
  constructor(name, statusCode, message) {
    super();
    this.name = name;
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ErrorHelper;
