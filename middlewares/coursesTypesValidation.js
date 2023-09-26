const { check } = require('express-validator');

// Array di validazioni per il metodo POST
exports.courseTypeValidations = [
  check('name')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 1 }).withMessage('Name cannot be empty')
];