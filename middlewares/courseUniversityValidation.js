const { check } = require('express-validator');

exports.associateCourseToUniversityValidation = [
  check('course_id').isInt().withMessage('course_id must be an integer'),
  check('university_id').isInt().withMessage('university_id must be an integer')
];
