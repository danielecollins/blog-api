const express = require("express");
const createError = require("http-errors")

const routes = express.Router({
    mergeParams: true
});

const commentController = require("../controller/comment");

const isAuth = (req, res, next) => {
    if (!req.user) {
        next(createError(422, "User Is not logged in"))
    } else {
        next()
    }
}

routes.get("/:id/:id", commentController.getCommentByPostId);
routes.get("/:id", commentController.getCommentByID);
routes.post("/posts/:id/", commentController.addComment);
routes.get("/userid/:id", isAuth, commentController.getCommentByUserID);
routes.delete("/:id", commentController.deleteComment);
routes.put("/:id", commentController.updateComment);

module.exports = routes;