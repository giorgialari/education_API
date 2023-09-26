const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/courseController');
const { validateCourse } = require('../middlewares/coursesValidation');
const allowMethods = require('../middlewares/allowMethods');

router.all('/courses', allowMethods(['GET', 'POST']));
router.get('/courses', coursesController.getAllCourses);
router.post('/courses', validateCourse, coursesController.createCourse);

router.all('/courses', allowMethods(['GET', 'PUT', 'DELETE']));
router.get('/courses/:id', coursesController.getCourseById);
router.put('/courses/:id', validateCourse, coursesController.updateCourse);
router.delete('/courses/:id', coursesController.deleteCourse);

module.exports = router;
