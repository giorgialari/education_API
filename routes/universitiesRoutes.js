const express = require("express");
const router = express.Router();
const universitiesController = require('../controllers/universitiesController');
const allowMethods = require('../middlewares/allowMethods');
const universitiesValidation = require('../middlewares/universitiesValidation');


router.all("/universities", allowMethods(["GET", "POST"]));
router.get("/universities", universitiesController.getAllUniversities);
router.post("/universities", universitiesValidation.validateUniversity, universitiesController.createUniversity);

router.all("/universities/:id", allowMethods(["GET", "PUT", "DELETE"]));
router.get("/universities/:id", universitiesController.getUniversityById);
router.put("/universities/:id", universitiesValidation.validateUniversity, universitiesController.updateUniversity);
router.delete("/universities/:id", universitiesController.deleteUniversity);

module.exports = router;
