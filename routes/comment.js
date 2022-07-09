const express = require('express');
const routes = require('.');
const router = express.Router();

const commentController = require('../controller/comment');

routes.get("/:id", commentController.getPostById)
routes.get("/:id", commentController.getCommentByID)
routes.post("/", commentController.addComment )
routes.get("/:id", commentController.getUserByID )
routes.delete("/:id", commentController.deleteComment )
routes.put("/:id", commentController.updateComment )

module.exports = router;
