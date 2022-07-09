const router = require('express').Router();

const courseController = require('../controllers/courseController');

router.post('/', courseController.addCourse);
router.get('/', courseController.getAllCourses);
router.get('/:title', courseController.getCourseTitle);
router.get('/:id', courseController.getCourseId);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;