const routes = require("express").Router();
const passport = require("passport");
const { google, googleRedirect, logout } = require("../controller/auth");

routes.get("/logout", logout);

routes.get("/success", (req, res, next) => {
  res.send("User successfully Logged In");
});

//auth with google
routes.get("/google", google);

routes.get("/google/redirect", passport.authenticate("google"), googleRedirect);

module.exports = routes;
