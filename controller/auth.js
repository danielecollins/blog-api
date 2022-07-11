const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Joi = require("joi");
const createError = require("http-errors");

const login = async (req, res, next) => {
  /*  
  // #swagger.description = 'Login a User'
  #swagger.parameters['User'] = {
                in: 'body',
                description: 'Login User',
                schema: {
                      $email: "professor@byui.edu",
                      $password: "Potter11?",
                }
        }
        #swagger.responses[200] = {
            description: 'User successfully Logged In'}
        #swagger.responses[422] = {
            description: 'Kindly check the provided data'}
            

        */
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string(),
  });

  try {
    //validation
    const value = await schema.validateAsync(req.body);

    const user = await User.findOne({ email: value.email });

    if (!user) {
      next(createError.UnprocessableEntity("User Not FOund"));
    }

    bcrypt.compare(value.password, user.password, function (err, result) {
      if (err) {
        next(error);
        return;
      }
      if (result) {
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.send("User successfully Logged In");
        });
      } else {
        next(createError.UnprocessableEntity("Password does not match"));
      }
    });
  } catch (error) {
    next(error);
  }
};

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

module.exports = { google, googleRedirect, logout, login };
