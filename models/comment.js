const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
    {
    content: { type: String, required: true },
    date: {
      type: Date,
      default: Date.now
   },
   post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    },

  },
  {
    strict: false,
    collection: "comments"
  })

  module.exports = mongoose.model('Comment', commentSchema);