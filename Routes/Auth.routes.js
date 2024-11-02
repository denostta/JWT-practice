const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../Models/Users.model");
const { userSchema } = require("../helpers/validators");
const { signAccessToken } = require("../helpers/jwt.helpers.js");

// **************************************************************************

//HOME PAGE ROUTE
router.get("/all", async (req, res, next) => {
  res.send("all users route");
});

// **************************************************************************
//REGISTRATION ROUTE
router.post("/register", async (req, res, next) => {
  try {
    // validate the user input
    const result = await userSchema.validateAsync(req.body);
    console.log(result);

    // check if the email already exists in database
    const doExist = await User.findOne({ email: result.email });
    if (doExist) {
      throw createError.Conflict("Email already exists");
    }
    // if the email did not exist, create and save a new user
    const user = new User({ email: result.email, password: result.password });
    const saveUser = await user.save();
    // create a token for the user
    const accessToken = await signAccessToken(saveUser.id);
    //send response if succesful registration is done
    res.send({ accessToken });
    // catch the error is there's any
  } catch (error) {
    console.log("there is an error");
    console.log(error.isJoi); //not working

    if (error) error.status = 422;
    next(error);
  }
});

// **************************************************************************
//LOGIN ROUTE
router.post("/login", async (req, res, next) => {
  try {
    // request the data submitted by the user and validate using userSchema
    const result = await userSchema.validateAsync(req.body);
    // find the user in the database
    const user = await User.findOne({ email: result.email });
    // if the user does not exist, throw an error
    if (!user) {
      throw createError.NotFound("User is not registered");
    }
    // if the user exists, compare the password
    const isMatch = await user.isValidPassword(result.password);
    // if the password is not correct, throw an error
    if (!isMatch) {
      throw createError.Unauthorized("Username/Password not valid");
    }
    // if the password is correct, create a token
    const accessToken = await signAccessToken(user.id);
    console.log(result);
    res.send({ accessToken });
  } catch (error) {
    // if the error is from Joi
    if (error.isJoi === true)
      return next(createError.BadRequest("Invalid Username/Password"));

    //if there is an error send post request from the client fwd the error to error midddleware
    next(error);
  }
});

// **************************************************************************

//REFRESH-TOKEN ROUTE
router.post("/refresh-token", async (req, res, next) => {
  res.send("refresh token route");
});

// **************************************************************************
//LOGOUT ROUTE
router.delete("/logout", async (req, res, next) => {
  res.send("logout route");
});

// **************************************************************************

//EXPORT router MODULE
module.exports = router;
