const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/user");
const createError = require("http-errors");
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);

  done(null, user);
});

passport.use(
  new googleStrategy(
    {
      //oauth details from google
      callbackURL: "/users/auth/google/redirect",
      clientID: process.env.clientID,
      clientSecret: process.env.clientSec,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          done(null, user);
        } else {
          const doc = {
            firstName: profile.name.givenName,
            email: profile.emails[0].value,
          };
          const userSch = new User(doc);
          const saveResult = await userSch.save();
          done(null, saveResult);
        }
      } catch (error) {
        if (error.name == "ValidationError") {
          done(createError.UnprocessableEntity(error.message));
          return;
        }
        done(error);
      }
    }
  )
);
