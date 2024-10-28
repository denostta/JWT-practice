const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../Models/Users.model.js");

// **************************************************************************

//HOME PAGE ROUTE
router.get("/all", async (req, res, next) => {
  res.send("all users route");
});

// **************************************************************************
//REGISTRATION ROUTE
router.post("/register", async (req, res, next) => {
  console.log(req.body);
  try {
    // extract the email and password from the request body
    const { email, password } = req.body;
    //verify the email and password if meet the requirements
    if (!email || !password) {
      throw createError.BadRequest("Email and password are required");
    }
    // check if the email already exists in database
    const doExist = await User.findOne({ email: email });
    if (doExist) {
      throw createError.Conflict("Email already exists");
    }
    // if the email did not exist, create and save a new user
    const user = new User({ email, password });
    const saveUser = await user.save();
    //send response if succesful registration is done
    res.send(`${saveUser}, registration successful`);
  } catch (error) {
    next(error);
  }
});

// **************************************************************************
//LOGIN ROUTE
router.post("/login", async (req, res, next) => {
  res.send("login route");
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
