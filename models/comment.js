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
    ref: 'Posts',
    },

  },
  {
    strict: false,
    collection: "comments"
  })

  module.exports = mongoose.model('Comment', commentSchema);