const express = require("express");

const routes = express.Router();

const commentController = require("../controller/comment");

routes.get("/postid/:id", commentController.getCommentByPostId);
routes.get("/:id", commentController.getCommentByID);

routes.post("/comment", commentController.addComment);

routes.get("/userid/:id", commentController.getCommentByUserID);
routes.delete("/:id", commentController.deleteComment);
routes.put("/:id", commentController.updateComment);

module.exports = routes;
