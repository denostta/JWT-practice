const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

//create Schema model
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true, // any email will be converted into lowercase
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
});

// create a user model
const User = mongoose.model("user", UserSchema); //"user" is the name of the collection

//export the module
module.exports = User;
