const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    body: {
      type: String,
    },
    userid: {
      type: String,
    },
    category: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    strict: false,
  }
);

module.exports = mongoose.model("Post", postSchema);
