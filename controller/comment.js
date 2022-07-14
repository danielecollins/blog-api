const mongoose = require("mongoose");
const Comment = require('../models/comment');
const createError = require("http-errors");
const comment = require('../models/comment');
//const ObjectId = require('mongoose').ObjectId;




const getCommentByPostId = () => {};
const getCommentByID = async (req, res, next) => {
  try {

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      next(createError(422, "Comment does not exist"));
      return;
    }
    res.status(200).json(comment);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid comment ID"));
      return;
    }
    next(error);
  }
};

//create a comment
const addComment = async (req, res,next) => {
  try {
    const newComment = new Comment({content:req.body.content});
    await newComment.save()
    res.json({
      status: 200,
      message: "New comment added",
    });
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(error);
  }

  };
const getCommentByUserID = () => {};
const deleteComment = () => {};
const updateComment = () => {};

module.exports = {
  getCommentByPostId,
  getCommentByID,
  addComment,
  getCommentByUserID,
  deleteComment,
  updateComment,
};
