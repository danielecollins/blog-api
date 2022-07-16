const routes = require("express").Router();
const {
  getAllPost,
  getPostById,
  getPostByTitle,
  getPostByCategory,
  getPostByUser,
  addPost,
  updatePost,
  deletePost,
} = require("../controller/post");

const Authroute = require("./auth");

const isAuth = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send("This is a protected resource, log in to continue");
  }
};

//Get all posts
routes.get("/", getAllPost);
//Get a single post by post id
routes.get("/:id", getPostById);
//Get a post by title
routes.get("/title/:title", getPostByTitle);
//Get all posts in a certain category
routes.get("/category/:category", getPostByCategory);
//Get all posts for a user
routes.get("/user/:user", getPostByUser);
//Create a post
routes.post("/:id", isAuth, addPost);
//Update a post
routes.put("/:id", isAuth, updatePost);
//Delete a post
routes.delete("/:id", isAuth, deletePost);

//auth login
routes.use("/auth", Authroute);

module.exports = routes;
