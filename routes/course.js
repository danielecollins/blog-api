const router = require("express").Router();

const courseController = require("../controller/course/course");

router.post("/", courseController.addCourse);
router.get("/", courseController.getAllCourses);
router.get("/title/:title", courseController.getCourseTitle);
router.get("/:id", courseController.getCourseId);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

module.exports = router;
