const universitiesModel = require("../models/universitiesModel");

exports.getAllUniversities = async (req, res, next) => {
  try {
    const results = await universitiesModel.getAllUniversities();
    res.status(200).json(results);
  } catch (e) {
    return next(e);
  }
};

exports.getUniversityById = async (req, res, next) => {
  try {
    const result = await universitiesModel.getUniversityById(req.params.id);
    res.status(200).json(result);
  } catch (e) {
    return next(e);
  }
};

exports.createUniversity = async (req, res, next) => {
  try {
    const result = await universitiesModel.createUniversity(req.body.name);
    res.status(201).json(result);
  } catch (e) {
    return next(e);
  }
};

exports.updateUniversity = async (req, res, next) => {
  try {
    // Verifico se l'università esiste
    const existingUniversity = await universitiesModel.getUniversityById(req.params.id);
    if (existingUniversity.length === 0) {
      const error = new Error('University not found');
      error.type = 'entity.not.found';
      return next(error);
    }

    // Se esiste, eseguo l'aggiornamento
    const result = await universitiesModel.updateUniversity(req.params.id, req.body.name);
    res.status(200).json(result);
  } catch (e) {
    return next(e);
  }
};


exports.deleteUniversity = async (req, res, next) => {
  try {
    // Prima verifico se l'università esiste
    const checkResult = await universitiesModel.getUniversityById(req.params.id);
    
    if (checkResult.length === 0) {
        const error = new Error("Entity not found");
        error.type = "entity.not.found";
        return next(error);
      }
  
    const result = await universitiesModel.deleteUniversity(req.params.id);
    res.status(200).json(result);
  } catch (e) {
    return next(e);
  }
};
