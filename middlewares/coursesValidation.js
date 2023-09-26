const { check } = require('express-validator');

exports.validateCourseType = [
  // Regole di validazione per i tipi di corsi
  check('name').isString().withMessage('Name must be a string').isLength({ min: 1 }).withMessage('Name cannot be empty')
];

exports.validateCourse = [
  // Regole di validazione per i corsi
  check('name').isString().withMessage('Name must be a string').isLength({ min: 1 }).withMessage('Name cannot be empty'),
  check('idType').isInt().withMessage('idType must be an integer')
];
