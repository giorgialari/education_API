const express = require('express');
const router = express.Router();
const courseTypesController = require('../controllers/courseTypesController');
const { courseTypeValidations } = require('../middlewares/coursesTypesValidation');
const allowMethods = require('../middlewares/allowMethods');

router.all('/courseTypes', allowMethods(['GET']));
router.get('/courseTypes', courseTypesController.getAllCourseTypes);

router.all('/courseTypes/:id', allowMethods(['GET']));
router.get('/courseTypes/:id', courseTypesController.getCourseTypeById);

router.all('/courseTypes', allowMethods(['POST']));
router.post('/courseTypes', courseTypeValidations, courseTypesController.createCourseType);

module.exports = router;
