const mongoose = require("mongoose");
const Comment = require('../models/comment');
const createError = require("http-errors");
const Post = require('../models/post');


const getCommentByPostId = async (req, res, next) => {
  try{
    const result = await Comment.findOne({_id: req.params.postId});

    if(result){

    }
  }catch(error){

  }
};

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
      status: 201,
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
const deleteComment = async (req, res, next) => {
  try {
    const result = await Comment.deleteOne({
      _id: req.params.id
    });

    if (result.deletedCount === 1) {

      res.status(200).json({message: "Successfully deleted one document."});
    } else {

      res.status(500).json(result.error || 'No documents matched the query. Deleted 0 documents.')
    }
  } catch (error) {
    if (error instanceof mongoose.CastError) {

      next(createError(422, "Invalid comment ID"));
      return;
    }
    next(error);
  }
};

//update comment
const updateComment = async(req, res, next) => {
  try{
    const myComment = {
      //to be validated
      content: req.body.content
    };

    const updateResult = await Comment.updateOne({
      _id: req.params.id
    }, myComment);
    if (updateResult.modifiedCount > 0) {
      res.status(200).json({message: "Comment updated successfully!"});
    } else {

      res.status(200).send(`No update was made`);
    }
  
    //console.log(`${updateResult.modifiedCount} document(s) was updated.`)

  }catch(error){
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid content to update"));
      return;
    }
    next(error);
  }
};

module.exports = {
  getCommentByPostId,
  getCommentByID,
  addComment,
  getCommentByUserID,
  deleteComment,
  updateComment,
};
