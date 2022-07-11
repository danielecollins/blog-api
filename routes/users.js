const routes = require("express").Router();
const {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/users");

const Authroute = require("./auth");

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
routes.use("/auth", Authroute);

module.exports = routes;
