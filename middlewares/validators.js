const utilsHelper = require("../helpers/utils.helper");
const mongoose = require("mongoose");
// install express-validator
const { validationResult } = require("express-validator");
const validators = {};

validators.validate = (validationArray) => async (req, res, next) => {
  console.log("ahuhu", validationArray);
  await Promise.all(validationArray.map((validation) => validation.run(req)));
  console.log("validate", req.body);
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  console.log(errors);
  const extractedErrors = [];
  errors
    .array()
    .map((error) => extractedErrors.push({ [error.param]: error.msg }));
  return utilsHelper.sendResponse(
    res,
    422,
    false,
    null,
    extractedErrors,
    "Validation Error"
  );
};

validators.checkObjectId = (paramId) => {
  if (!mongoose.Types.ObjectId.isValid(paramId)) {
    throw new Error("Invalid ObjectId");
  }
  return true;
};

module.exports = validators;
