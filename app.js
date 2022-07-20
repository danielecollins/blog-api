const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Routes = require("./routes");
const passportSetup = require("./config/passport-setup");
const cookieSession = require("cookie-session");
const passport = require("passport");
const dotenv = require("dotenv");

dotenv.config();

//init express and middlewares
const app = express();
app.use(bodyParser.json());
app.use(cors({ credentials: true }));

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.keys],
  })
);
//passport
app.enable("trust proxy");
app.use(passport.initialize());
app.use(passport.session());

//enabling CORS for all requests
app.use(cors());

//routes
app.use("/", Routes);

module.exports = app;
