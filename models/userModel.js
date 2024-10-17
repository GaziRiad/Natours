/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");

const useSchema = new mongoose.Schema(
  {
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
      minLength: [8, "A password should have atleast 8 characters"],
    },
    passwordConfirm: {
      type: String,
      validate: {
        // This works only on CREATE and SAVE!!
        validator: function (value) {
          return this.password === value;
        },
        message: "Passwords needs to match",
      },
    },
  },
  { timestamps: true },
);

useSchema.pre("save", async function (next) {
  //Only run this func if password was actually modified
  if (!this.isModified("password")) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // DELETE THE FIELD passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", useSchema);

module.exports = User;
