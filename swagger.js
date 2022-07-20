const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Blog API",
    description:
      "A Blog API that allows authors to publish posts and comment on other posts",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./routes/swagger-output local.json";
const endpointsFiles = ["./routes/index.js"];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
