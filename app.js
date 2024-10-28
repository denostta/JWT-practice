const express = require("express"); //used to create node js server
const morgan = require("morgan"); // used for console log in the server
const createError = require("http-errors"); // used to create an error
require("dotenv").config(); // used to secure environmental variables for security
require("./helpers/init_mongodb.js"); // to import init_mongodb.js file
const authRoutes = require("./Routes/Auth.routes"); // used to create routes

const app = express(); //use to create express app
app.use(morgan("dev")); //use to log the request in the console
app.use(express.json()); //used to parse the incoming request with JSON payloads
app.use(express.urlencoded({ extended: true })); //used to parse the incoming request with urlencoded payloads
const PORT = process.env.PORT || 3000; //used to create server port

// -------------------------------------------------------------------------------------
// HOME PAGE ROUTE GET REQUEST
// when example GET request "http://localhost:3000" or "IP Address:3000" is called.
app.get("/", (req, res, next) => {
  res.send("Hello World");
  console.log("hello world");
});

// -------------------------------------------------------------------------------------
// CREATING MAIN AUTH ROUTES
app.use("/auth", authRoutes); // used to create routes

// -------------------------------------------------------------------------------------
// PAGE NOT FOUND HANDLER
// If the client route is not available in the server
// when example GET request "http://localhost:3000/xyz" or "IP Address:3000/xyz" is called.
// The error will be forwarded to the error middleware using next(error)
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// -------------------------------------------------------------------------------------
// ERROR MIDDLEWARE
// all errors are handled here
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

// setup port and log to determine that server is  running
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
