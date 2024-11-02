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

// before saving the password hash it
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
});

//if the user exists, compare the password
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

// create a user model
const User = mongoose.model("user", UserSchema); //"user" is the name of the collection

//export the module
module.exports = User;
