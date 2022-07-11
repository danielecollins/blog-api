const passport = require("passport");

const logout = async (req, res, next) => {
  // #swagger.description = 'Logout a User'
  try {
    req.logout();
    res.send("Logout Succeful");
  } catch (error) {
    next(error);
  }
};

const google = passport.authenticate("google", {
  scope: ["email", "profile"],
});

const googleRedirect = async (req, res, next) => {
  res.redirect("/users/auth/success");
};

module.exports = { google, googleRedirect, logout };
