const router = require("express").Router();
const courseController = require("../controller/course/course");
const Authroute = require("./auth");

const isAuth = async (req, res, next) => {
  if (req.user) {
    next();
  } 
  else {
    res.send("This is a protected resource, log in to continue");
  }
};

router.post("/", isAuth, courseController.addCourse);
router.get("/", courseController.getAllCourses);
router.get("/title/:title", courseController.getCourseTitle);
router.get("/:id", courseController.getCourseId);
router.put("/:id", isAuth, courseController.updateCourse);
router.delete("/:id", isAuth, courseController.deleteCourse);

//auth login
router.use("/auth", Authroute);

module.exports = router;
