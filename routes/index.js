const routes = require("express").Router();
const createError = require("http-errors");
//const UsersRoute = require("./users");
const swaggerUi = require("swagger-ui-express");
//const swaggerDocument = require("./swagger-output.json");
//const authRoute = require("./auth");

//express static
//routes.use(express.static(path.join(__dirname, "../views")));

//Home route
routes.get("/", (req, res) => {
  // #swagger.description = 'API home route'
  // const user = req.user ? req.user : {};
  // res.render("index", { user: user });

  res.json({
    name: "Blog API",
    version: "1.0.0",
    description: "",
    Author: "",
  });
});

//auth
//routes.use("/auth", authRoute);

//products route
//routes.use("/products", productsRoute);




//api route
//routes.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
