const mongoose = require("mongoose");
const Comment = require('../models/comment');
const Post = require('../models/post');
const createError = require("http-errors");



const getCommentByPostId = async (req, res) => {
  try{
    const result = await Comment.find({postId: req.body.postId});
  }catch(err){
    console.log(err);
  }
  
};
//get a comment using an id
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

//create a comment and associate it to a post using post id
const addComment = async (req, res, next) => {
  const content = req.body.content;
  const postId = req.params.id;
  try {
    //create new comment to be associated
    const newComment = new Comment({content:content,
                                    post: postId});
    
    //save comment to db(comment collection)
    await newComment.save();
    //find related post by id and add the saved comment
    const relatedPost = await Post.findById(req.params.id).lean().populate('comments');
    //console.log(relatedPost);
    if (!relatedPost) {
      next(createError(422, "Post does not exist"));
      return;}else{
        console.log(relatedPost);
      }
    //push the comment into the post.comments array
    relatedPost.comments.push(newComment);

    // save and redirect...
    await relatedPost.save();
    // res.json({
    //   status: 201,
    //   message: "New comment added",
    // });
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(error);
  }

  };
const getCommentByUserID = () => {

  try{
    //check if the person is signed in
    
    const findComment = await Comment.find({userId:req.user.id});

    res.status(200).json(findComment);

  }catch(err){

  }
};


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
