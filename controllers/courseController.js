const courseModel = require('../models/coursesModel');
const { validationResult } = require('express-validator');

// GET /courses
exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await courseModel.getAllCourses();
    if (courses.length === 0) {
      const error = new Error('No courses found');
      error.type = 'entity.not.found';
      return next(error);
    }
    res.json(courses);
  } catch (e) {
    return next(e);
  }
};

// GET /courses/:id
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await courseModel.getCourseById(req.params.id);
    if (!course) {
      const error = new Error('Course not found');
      error.type = 'entity.not.found';
      return next(error);
    }
    res.json(course);
  } catch (e) {
    return next(e);
  }
};

// POST /courses
exports.createCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error');
    error.type = 'validation.error';
    error.details = errors.array();
    return next(error);
  }

  try {
    const result = await courseModel.createCourse(req.body.name, req.body.idType);
    res.status(201).json(result);
  } catch (e) {
    return next(e);
  }
};

// PUT /courses/:id
exports.updateCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error');
    error.type = 'validation.error';
    error.details = errors.array();
    return next(error);
  }

  try {
    const course = await courseModel.getCourseById(req.params.id);
    if (!course) {
      const error = new Error('Entity not found');
      error.type = 'entity.not.found';
      return next(error);
    }

    const result = await courseModel.updateCourse(req.params.id, req.body.name, req.body.idType);
    res.status(201).json(result);
  } catch (e) {
    return next(e);
  }
};

// DELETE /courses/:id
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await courseModel.getCourseById(req.params.id);
    if (!course) {
      const error = new Error('Entity not found');
      error.type = 'entity.not.found';
      return next(error);
    }

    await courseModel.deleteCourse(req.params.id);
    res.status(200).json({ message: 'Course deleted' });
  } catch (e) {
    return next(e);
  }
};
