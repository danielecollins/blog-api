const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
    {
    content: { type: String, required: true },
  },
  {
    strict: false,
    collection: "comment",
  }, 
  { timestamps: true });

  module.exports = mongoose.model('Comment', commentSchema);