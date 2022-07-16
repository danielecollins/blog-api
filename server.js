const mongodb = require("./db/connect");
const app = require("./app");
const PORT = process.env.PORT || 3000;

//start server and db
mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(PORT);
    console.log(`Connected to DB and listening on ${PORT}`);
  }
});
