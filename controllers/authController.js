const utilsHelper = require("../helpers/utils.helper");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const catchAsync = utilsHelper.catchAsync;
const authController = {};
const axios = require("axios");

authController.loginWithEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }, "+password");
    if (!user) return next(new Error("Invalid credentials"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new Error("Wrong password"));

    accessToken = await user.generateToken();
    return utilsHelper.sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Login successful"
    );
  } catch (error) {
    next(error);
  }
};

//Login with Facebook

authController.loginWithFacebook = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const {
    data,
  } = await axios.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}
  `);
  console.log(data);
  const { email, name } = data;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
    });
  }
  const accessToken = await user.generateToken();
  return utilsHelper.sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login with Facebook successful"
  );
});

//Login with Google

authController.loginWithGoogle = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const { data } = await axios.get(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
  );
  console.log(data);
  //Co r thi dung user do
  const { email, name } = data;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
    });
  }
  const accessToken = await user.generateToken();
  return utilsHelper.sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login with Google successful"
  );
});

module.exports = authController;
