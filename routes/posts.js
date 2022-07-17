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
} = require("../controller/post/post");

routes.get("/", getAllPost);
routes.get("/:id", getPostById);
routes.get("/title/:title", getPostByTitle);
routes.get("/category/:category", getPostByCategory);
routes.get("/user/:user", getPostByUser);
routes.post("/", addPost);
routes.put("/", updatePost);
routes.delete("/", deletePost);

module.exports = routes;
