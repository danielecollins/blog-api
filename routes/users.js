const routes = require("express").Router();
const {
  getUser,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/users");

const Authroute = require("./auth");

const isAuth = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send("This is a protected resouce, log in to continue");
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

//display users data
routes.get("/", isAuth, getUser);

//get user by username/id?
routes.get("/:id", isAuth, getUserById);

//create new user
routes.post("/", createUser);

//Update User by id
routes.put("/:id", isAuth, isUser, updateUser);

//Delete User
routes.delete("/:id", isAuth, isUser, deleteUser);

//auth login
routes.use("/auth", Authroute);

module.exports = routes;
