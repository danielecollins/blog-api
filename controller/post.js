const mongoose = require("mongoose");
const Post = require('../models/post');
const createError = require("http-errors");

const getAllPost = () => {};
const getPostById = async (req, res, next) => {
  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      next(createError(422, "This post does not exist"));
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    if (error instanceof mongoose.CastError) {
      next(createError(422, "Invalid comment ID"));
      return;
    }
    next(error);
  }
};
const getPostByTitle = () => {};
const getPostByCategory = () => {};
const getPostByUser = () => {};

//add a new post
const addPost = async (req,res, next) => {
  const postContent = {
    title: req.body.title,
    body: req.body.body,
    userId: req.body.userId,
    category: req.body.category
  };
  try{
    const newPost = new Post(postContent);
    await newPost.save();

    // res.json({
    //   status: 201,
    //   message: "New post created",
    // });
  }catch(error){
    if (error.name == "ValidationError") {
      next(createError.UnprocessableEntity(error.message));
      return;
    }
    next(error);
  }
};
const updatePost = () => {};
const deletePost = () => {};

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
