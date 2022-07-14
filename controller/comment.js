const Comment = require('../models/comment');
const createError = require("http-errors");


const getCommentByPostId = () => {};
const getCommentByID = () => {};

//create a comment
const addComment = async (req, res,next) => {
  try {
    const comment = new Comment({content:req.body.content});
    await comment.save()
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
