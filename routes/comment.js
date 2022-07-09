const express = require('express');
const routes = require('.');
const router = express.Router();

const commentController = require('../controller/comment');
const postController = require('../controller/post');
const userController = require('../controller/user');

routes.get("/:id", postController.getPostById)
routes.get("/:id", commentController.getCommentByID)
routes.post("/", commentController.addComment )
routes.get("/:id", userController.getUserByID )
routes.delete("/:id", commentController.deleteComment )
routes.put("/:id", commentController.updateComment )

module.exports = router;
