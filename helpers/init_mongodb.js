const mongoose = require("mongoose");

//connecting to mongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DBNAME,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err.message));

//creating callback for connected event
mongoose.connection.on("connected", () => {
  console.log("mongoose connected to db");
});

// // creating callback for error event
mongoose.connection.on("error", (err) => {
  console.log(err.message);
});

// //creating callback for disconnected event
mongoose.connection.on("disconnected", () => {
  console.log("mongoose disconnected");
});

// closing the mongodb connection first if the server stops
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
