const {
  body,
  validationResult,
  param,
} = require("express-validator");

const loginValidationRules = () => {
  return [
    // username must not be empty
    body("username").notEmpty(),
    // password must not be empty
    body("password").notEmpty(),
  ];
};

const registerValidationRules = () => {
  return [
    // username must not be empty
    body("username")
      .notEmpty()
      .exists(),
    // password must be atleast 8 characters
    body("password")
      .isLength({ min: 8 })
      .withMessage("Too short, needs atleast 8 characters.")
      .exists(),
    // firstname must not be empty
    body("firstName")
      .notEmpty()
      .exists(),
    // lastname must not be empty
    body("lastName")
      .notEmpty()
      .exists(),
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
      .optional(),
    // password must be atleast 8 characters
    body("password")
      .isLength({ min: 8 })
      .withMessage("Too short, needs atleast 8 characters.")
      .optional(),
    // firstname must not be empty
    body("firstName")
      .notEmpty()
      .optional(),
    // lastname must not be empty
    body("lastName")
      .notEmpty()
      .optional(),
    // lastname must not be empty
    body("role")
      .not()
      .exists(),
    param("id").isLength({ min: 24, max: 24 }),
  ];
};

const checkId = () => {
  return param("id").isLength({ min: 24, max: 24 });
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

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  loginValidationRules,
  registerValidationRules,
  updateValidationRules,
  checkId,
  validate,
};

/*
5e 29 d4 9c 88 8b      ae 40 80 61 54 dd
5e29fd305c29204928f0818b
5e3016ce88d54e3d9ca774c6
5e303828ae40010970748c88
*/
