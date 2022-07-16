const mongoose = require("mongoose");
const Comment = require("../models/comment");
const createError = require("http-errors");
const Joi = require("joi");

const getCommentByPostId = async (req, res, next) => {
  /*  
  // #swagger.description = 'Get comment by PostId'
  #swagger.parameters['Comment'] = {
                in: 'body',
                description: 'Get Comment by PostId',
                
        }
        #swagger.responses[200] = {
            description: [array of comments]}
        #swagger.responses[422] = {
            description: 'No comments for this post'}
            
        */
  try {
    const result = await Comment.find({ postId: req.params.postId });

    if (result.length === 0) {
      next(createError(422, "No comment for this post"));
      return;
    }
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};
//get a comment using an id
const getCommentByID = async (req, res, next) => {
  /*  
  // #swagger.description = 'Get comment by CommentId'
  #swagger.parameters['Comment'] = {
                in: 'body',
                description: 'Get Comment by CommentId',
                
        }
        #swagger.responses[200] = {
            description: {a comment object}}
        #swagger.responses[422] = {
            description: 'Invalid comment ID'}
            
        */
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
  /*  
  // #swagger.description = 'Adds a new Comment'
  #swagger.parameters['Comment'] = {
                in: 'body',
                description: 'New Comment',
                schema: {
                    $comment: 'This is a test comment',
                    $postId: 'Pottesuidhnkr',
                    $userId: "dbfkjdnfdffd",
                    
                }
        }
        #swagger.responses[200] = {
            description: 'Comment successfully added'}
        #swagger.responses[422] = {
            description: 'Kindly check the provided data'}
            
        */
  try {
    //create new comment to be associated
    const newComment = new Comment(req.body);
    const result = await newComment.save();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const getCommentByUserID = async () => {
  /*  
  // #swagger.description = 'Get comment by UserId'
  #swagger.parameters['Comment'] = {
                in: 'body',
                description: 'Get Comment by UserId',
                
        }
        #swagger.responses[200] = {
            description: [array of comments]}
        #swagger.responses[422] = {
            description: 'No comments for this post'}
            
        */
  try {
    //check if the person is signed in

    const findComment = await Comment.find({ userId: req.user.id });

    if (findComment.length === 0) {
      next(createError(422, "No comment for this post"));
      return;
    }

    res.status(200).json(findComment);
  } catch (err) {}
};

const deleteComment = async (req, res, next) => {
  /*  
  // #swagger.description = 'Delete comment by CommentId'
  #swagger.parameters['Comment'] = {
                in: 'body',
                description: 'Delete comment by CommentId',
                
        }
        #swagger.responses[200] = {
            description: "Successfully deleted one document."}
        #swagger.responses[422] = {
            description: 'No comment to delete'}
            
        */
  try {
    const result = await Comment.deleteOne({
      _id: req.params.id,
    });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Successfully deleted one document." });
    } else {
      next(createError(422, "No comment to delete"));
      return;
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
const updateComment = async (req, res, next) => {
  const schema = Joi.object().keys({
    comment: Joi.string(),
    userId: Joi.string(),
    postId: Joi.string(),
  });

  try {
    const value = await schema.validateAsync(req.body);

    const updateResult = await Comment.updateOne(
      {
        _id: req.params.id,
      },
      value
    );
    if (updateResult.modifiedCount > 0) {
      res.status(200).json({ message: "Comment updated successfully!" });
    } else {
      res.status(200).send(`No update was made`);
    }

    //console.log(`${updateResult.modifiedCount} document(s) was updated.`)
  } catch (error) {
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
