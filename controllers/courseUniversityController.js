const courseUniversityModel = require('../models/courseUniversityModel');
const { validationResult } = require('express-validator');

exports.associateCourseToUniversity = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error');
    error.type = 'validation.error';
    error.details = errors.array();
    return next(error);
  }

  try {
    //Prima verifico se l'associazione già esistente
    const existingAssociation = await courseUniversityModel.checkExistingAssociation(req.body.course_id, req.body.university_id);
    if (existingAssociation) {
      const error = new Error('Association already exists');
      error.type = 'entity.already.exists';
      return next(error);
    }

    const result = await courseUniversityModel.associateCourseToUniversity(req.body.course_id, req.body.university_id);
    res.status(201).json(result);
  } catch (e) {
    return next(e);
  }
};


exports.getCoursesAndUniversities = async (req, res, next) => {
  try {
    const result = await courseUniversityModel.getCoursesAndUniversities(req.query.courseName, req.query.courseType);
    res.json(result);
  } catch (e) {
    return next(e);
  }
};
