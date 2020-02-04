const {
  body,
  validationResult,
  param,
  header,
} = require("express-validator");
const ErrorHelper = require("./error-helper");

const loginValidationRules = () => {
  return [
    // username must not be empty
    body("username")
      .notEmpty()
      .withMessage("Not Allowed to be empty.")
      .exists()
      .withMessage("Has to exist.")
      .isLength({ max: 25 })
      .withMessage("Too long, not more then 25 characters."),
    // password must not be empty
    body("password")
      .notEmpty()
      .withMessage("Not Allowed to be empty.")
      .exists()
      .withMessage("Has to exist.")
      .isLength({ min: 8, max: 25 })
      .withMessage(
        "Too short or too long, needs atleast 8 characters and not more then 25.",
      ),
  ];
};

const registerValidationRules = () => {
  return [
    // username must not be empty
    body("username")
      .notEmpty()
      .withMessage("Not Allowed to be empty.")
      .exists()
      .withMessage("Has to exist.")
      .isLength({ max: 25 })
      .withMessage("Too long, not more then 25 characters."),
    // password must be atleast 8 characters
    body("password")
      .isLength({ min: 8, max: 25 })
      .withMessage(
        "Too short or too long, needs atleast 8 characters and not more then 25.",
      )
      .exists()
      .withMessage("Has to exist."),
    // firstname must not be empty
    body("firstName")
      .notEmpty()
      .withMessage("Not Allowed to be empty.")
      .exists()
      .withMessage("Has to exist.")
      .isLength({ max: 25 })
      .withMessage("Too long, not more then 25 characters."),
    // lastname must not be empty
    body("lastName")
      .notEmpty()
      .withMessage("Not Allowed to be empty.")
      .exists()
      .withMessage("Has to exist.")
      .isLength({ max: 25 })
      .withMessage("Too long, not more then 25 characters."),
    // lastname must not be empty
    body("role")
      .not()
      .exists(),
  ];
};

const updateValidationRules = () => {
  return [
    // username must not be empty
    body("username")
      .notEmpty()
      .withMessage("Not Allowed to be empty. But not necessary.")
      .optional()
      .isLength({ max: 25 })
      .withMessage("Too long, not more then 25 characters."),
    // password must be atleast 8 characters
    body("password")
      .isLength({ min: 8, max: 25 })
      .withMessage(
        "Too short or too long, needs atleast 8 characters and not more then 25.",
      )
      .optional(),
    // firstname must not be empty
    body("firstName")
      .notEmpty()
      .withMessage("Not Allowed to be empty. But not necessary.")
      .optional()
      .isLength({ max: 25 })
      .withMessage("Too long, not more then 25 characters."),
    // lastname must not be empty
    body("lastName")
      .notEmpty()
      .withMessage("Not Allowed to be empty. But not necessary.")
      .optional()
      .isLength({ max: 25 })
      .withMessage("Too long, not more then 25 characters."),
    // lastname must not be empty
    body("role")
      .not()
      .exists(),
    param("id")
      .isLength({ min: 24, max: 24 })
      .withMessage("ID must be exactly 24 Characters long."),
  ];
};

const checkId = () => {
  //id must be exactly 24 chars long
  return param("id")
    .isLength({ min: 24, max: 24 })
    .withMessage("ID must be exactly 24 Characters long.");
};

const checkToken = () => {
  return header("authorization")
    .notEmpty()
    .withMessage("Not Allowed to be empty.")
    .exists()
    .withMessage("Has to exist.")
    .isLength({ min: 8 })
    .withMessage("Too short for a JWT.");
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors
    .array()
    .map(err => extractedErrors.push({ [err.param]: err.msg }));

  throw new ErrorHelper("Validation Error", 422, extractedErrors);
};

module.exports = {
  loginValidationRules,
  registerValidationRules,
  updateValidationRules,
  checkId,
  checkToken,
  validate,
};
