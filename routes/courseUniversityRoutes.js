const express = require('express');
const router = express.Router();
const courseUniversityController = require('../controllers/courseUniversityController');
const { associateCourseToUniversityValidation } = require('../middlewares/courseUniversityValidation');
const allowMethods = require('../middlewares/allowMethods');


router.all('/coursesAndUniversities', allowMethods(['GET']));
router.get('/coursesAndUniversities', courseUniversityController.getCoursesAndUniversities);

router.all('/associateCourseToUniversity', allowMethods(['POST']));
router.post('/associateCourseToUniversity', associateCourseToUniversityValidation, courseUniversityController.associateCourseToUniversity);

module.exports = router;
