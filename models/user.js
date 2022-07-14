const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    age: {
      type: String,
    },
    profession: {
      type: String,
    },
    password: {
      type: String,
    },
    level: {
      type: String,
      default: "author",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: false,
    collection: "users",
  }
);

module.exports = mongoose.model("User", userSchema);
