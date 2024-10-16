/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require("mongoose");
const validator = require("validator");

const useSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "A use must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "A use must have a password"],
    min: [8, "A password should have atleast 8 characters"],
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: "Passwords needs to match",
    },
  },
});

const User = mongoose.model("User", useSchema);

module.exports = User;
