const express = require("express");
const createError = require("http-errors");

const routes = express.Router({
  mergeParams: true,
});

const commentController = require("../controller/comment");

const isAuth = (req, res, next) => {
  if (!req.user) {
    next(createError(422, "User Is not logged in"));
  } else {
    next();
  }
};

const isUser = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    next();
  } else if (req.user.level === "admin") {
    next();
  } else {
    res.send("You can only manage a profile that belongs to you");
  }
};

routes.get("/postId/:postId", commentController.getCommentByPostId);
routes.get("/:id", commentController.getCommentByID);
routes.post("/", isAuth, commentController.addComment);
routes.get("/userid/:id", isAuth, commentController.getCommentByUserID);
routes.delete("/:id", isAuth, isUser, commentController.deleteComment);
routes.put("/:id", isAuth, isUser, commentController.updateComment);

module.exports = routes;
