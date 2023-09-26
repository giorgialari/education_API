const courseTypesModel = require('../models/courseTypesModel');
const { validationResult } = require('express-validator');

// GET /courseTypes
exports.getAllCourseTypes = async (req, res, next) => {
  try {
    const courseTypes = await courseTypesModel.getAllCourseTypes();
    if (courseTypes.length === 0) {
      const error = new Error('No course types found');
      error.type = 'entity.not.found';
      return next(error);
    }
    res.json(courseTypes);
  } catch (e) {
    return next(e);
  }
};

// GET /courseTypes/:id
exports.getCourseTypeById = async (req, res, next) => {
  try {
    const courseType = await courseTypesModel.getCourseTypeById(req.params.id);
    if (!courseType) {
      const error = new Error('Entity not found');
      error.type = 'entity.not.found';
      return next(error);
    }
    res.json(courseType);
  } catch (e) {
    return next(e);
  }
};

// POST /courseTypes
exports.createCourseType = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error');
    error.type = 'validation.error';
    error.details = errors.array();
    return next(error);
  }

  try {
    const result = await courseTypesModel.createCourseType(req.body.name);
    res.status(201).json(result);
  } catch (e) {
    return next(e);
  }
};
