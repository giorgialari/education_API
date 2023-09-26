const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const courseTypesRoutes = require('./routes/coursesTypesRoutes');
const coursesRoutes = require('./routes/courseRoutes');
const universitiesRoutes = require('./routes/universitiesRoutes');
const courseUniversityRoutes = require('./routes/courseUniversityRoutes');


const PORT = process.env.PORT || 3000;

//Requisito 1 e Requisito 2 - Corsi
app.use('/api', courseTypesRoutes);
app.use('/api', coursesRoutes);
//Requisito 3 - Atenei
app.use('/api', universitiesRoutes);
/*Requisito 4 - Associazione Corsi-Atenei e Requisito 5 (Visualizzare tutti i corsi e gli atenei associati + filtro per nome e tipo corso)*/
app.use('/api', courseUniversityRoutes);


// Middleware per la gestione degli errori
app.use((err, req, res, next) => {
  if (err.type === "entity.not.found") {
    return res.status(404).json({ error: "Resource not found" });
  }
  if (err.type === "validation.error") {
    return res.status(400).json({ error: "Validation error", details: err.details });
  }
  if (err.type === "entity.already.exists") {
    return res.status(400).json({ error: "Entity already exists" });
  }
  if (err.type === "database.error") {
    return res.status(500).json({ error: "Database error", sqlMessage: err.sqlMessage });  
  }
  // Gestione di tutti gli altri errori non specifici
  return res.status(500).json({ error: "Internal Server Error", sqlMessage: err.sqlMessage });
});

module.exports = app;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
