const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
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
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }]
  },
  {
    strict: false,
    collection: "posts",
    
  }
);

module.exports = mongoose.model("Post", postSchema);
