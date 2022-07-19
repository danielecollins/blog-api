const Post = require("../../models/post");
const Joi = require("joi");
const createError = require("http-errors");
const mongoose = require("mongoose");
const user = require("../../models/user");

const getAllPost = async (req, res, next) => {
  try {
    const result = await Post.find();

    if (result.length === 0) {
      next(createError(404, "No posts found"));
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      next(createError(422, "Post does not exist"));
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid Post ID"));
      return;
    }
    next(error);
  }
};

const getPostByTitle = async (req, res, next) => {
  try {
    const title = req.params.title;
    const post = await Post.find({ title: title });

    if (!post) {
      next(createError(422, "A post with this title does not exist"));
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const getPostByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;
    const post = await Post.find({ category: category });

    if (!post) {
      next(createError(422, "There are no posts in this category"));
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const getPostByUser = async (req, res, next) => {
  try {
    const userid = req.params.userid;
    const post = await Post.find({ userid: userid });

    if (!post) {
      next(createError(422, "This user does not have any posts"));
      return;
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const addPost = async (req, res, next) => {
  /*  
  // #swagger.description = 'Create a post'
  #swagger.parameters['Post'] = {
                in: 'body',
                description: 'Create a post',
                schema: {
                    $title: 'Post Title',
                    $body: 'Post body.',
                    $category: 'Category Name',
                }
        }
        #swagger.responses[200] = {
            description: 'Post successfully created'}
        #swagger.responses[422] = {
            description: 'Please check the provided data'}
            

        */

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    category: Joi.string().required(),
  });

  try {
    const value = await schema.validateAsync(req.body);

    //add the id of the signed in user
    value["userId"] = req.user.id;

    const post = new Post({
      title: value.title,
      body: value.body,
      userid: value.userId,
      category: value.category,
    });

    const savedPost = await post.save();

    res.json({
      status: 201,
      message: "New post created",
    });
  } catch (error) {
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  /*  
  // #swagger.description = 'Update a post'
  #swagger.parameters['Post'] = {
                in: 'body',
                description: 'Update a post',
                schema: {
                    title: 'Post Title',
                    body: 'Post body.',
                    category: 'Category Name',
                }
        }
        #swagger.responses[200] = {
            description: 'Post successfully updated'}
        #swagger.responses[422] = {
            description: 'Please provide information to be updated, Post does not exist, No update was made, Invalid post ID'}
            

        */

  const document = {};
  const keys = ["title", "body", "category"];

  for (const key in req.body) {
    if (typeof req.body[key] !== "undefined" && keys.includes(key)) {
      document[key] = req.body[key];
    }
  }

  if (Object.keys(document).length < 1) {
    next(createError(422, "Please provide information to be updated"));
    return;
  }

  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    category: Joi.string(),
  });

  try {
    const value = await schema.validateAsync(document);

    const updateResult = await Post.updateOne(
      { _id: req.params.id },
      { $set: value }
    );

    return updateResult.modifiedCount > 0
      ? res
          .status(200)
          .send(`Post with ID ${req.params.id} was updated successfully`)
      : updateResult.matchedCount < 1
      ? next(createError(422, "Post does not exist"))
      : res.status(200).send("No update was made");
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid post ID"));
      return;
    }
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  // #swagger.description = 'Delete an existing post'

  /*
              #swagger.responses[200] = {
            description: 'Post successfully Deleted'}
            #swagger.responses[422] = {
            description: 'Please check the provided post Id'}
  
  */

  try {
    const result = await Post.deleteOne({ _id: req.params.id });

    if (result.deletedCount < 1) {
      next(createError(422, "Post does not exist"));
      return;
    }

    res
      .status(200)
      .send(`Post with ID ${req.params.id} was deleted successfully`);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid User ID"));
      return;
    }
    next(error);
  }
};

module.exports = {
  getAllPost,
  getPostById,
  getPostByTitle,
  getPostByCategory,
  getPostByUser,
  addPost,
  updatePost,
  deletePost,
};
