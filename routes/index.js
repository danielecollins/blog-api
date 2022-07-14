const routes = require("express").Router();
const createError = require("http-errors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const UsersRoutes = require("./users");
const PostsRoutes = require("./posts");
const CommentsRoutes = require("./comment");
const CoursesRoutes = require("./course");

//express static
//routes.use(express.static(path.join(__dirname, "../views")));

routes.get("/", (req, res) => {
  // #swagger.description = 'API home route'
  // const user = req.user ? req.user : {};
  // res.render("index", { user: user });

  res.json({
    name: "Blog API",
    version: "1.0.0",
    description:
      "an API where we can have authors signup and they can publish articles, the articles are approved by the website admin and the website admin can also set an author to have all their posts approved automatically, and includes courses that can be viewed by users.",
    Author:
      "Ojo-Osasere Ayodeji Marcus, Mavuma Lusanda, Collins Daniel, Bryson Prince, Idoko Samson",
  });
});

//users
routes.use("/users", UsersRoutes);
//posts
routes.use("/posts", PostsRoutes);
//courses
routes.use("/courses", CoursesRoutes);
//comments
routes.use("/comments", CommentsRoutes);

//api route
routes.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//404 error handler
routes.use((req, res, next) => {
  next(createError.NotFound("Not Found"));
});

//error handler
routes.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

module.exports = routes;
