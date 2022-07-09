const routes = require("express").Router();
const {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  auth,
  logout,
  UserByUsername,
} = require("../controller/users");

//display users data
routes.get("/", getUser);

//get user by username/id?
routes.get("/:id", getUserById);

//create new user
routes.post("/", createUser);

//Update User by id
routes.put("/:id", updateUser);

//Delete User
routes.delete("/:id", deleteUser);

//auth login
routes.get("/auth", auth);

//user logout
routes.get("/logout", logout);

//get user by username
routes.get("/username/:username", UserByUsername);
module.exports = routes;
