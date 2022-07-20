const router = require("express").Router();
const courseController = require("../controller/course/course");

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

module.exports = router;
