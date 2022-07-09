const routes = require("express").Router();
const userController = require("../controller/users");

//display users data
routes.get("/", userController.getUser);

//get user by username/id?
<<<<<<< HEAD
routes.get("/:id", userController.getUserById);
=======
routes.get('/:id', userController.getUser);
>>>>>>> cc8c158f562c7f053b8519cf6b2508badd346e23

//create new user
routes.post("/", userController.createUser);

//Update User by id
routes.put("/:id", userController.updateUser);

//Delete User
routes.delete("/:id", userController.deleteUser);

//auth login
routes.get("/auth", userController.auth);

//user logout
routes.get("/logout", userController.logout);

//get user by username
routes.get("/username/:username", userController.UserByUsername);
module.exports = routes;
