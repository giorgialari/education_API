const { check } = require("express-validator");

exports.validateUniversity = [
  check("name").isString().withMessage("Name must be a string").isLength({ min: 1 }).withMessage("Name cannot be empty")
];
