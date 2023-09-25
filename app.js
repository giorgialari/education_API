const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { check, validationResult } = require("express-validator");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();

const PORT = process.env.PORT || 3000;

//crea una connessione al DB
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
});
function allowMethods(allowedMethods) {
  return (req, res, next) => {
    if (!allowedMethods.includes(req.method)) {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    next();
  };
}
//Requisito 1 - Tipologia corsi
// GET /courseTypes
app.get("/courseTypes", async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute("SELECT * FROM courseTypes");
    connection.release();

    if (results.length === 0) {
      const error = new Error("No course types found");
      error.type = "entity.not.found";
      return next(error);
    }

    res.status(201).json(results);
  } catch (e) {
    const error = new Error(e.message);

    if (e.code === "ER_BAD_DB_ERROR") {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }

    return next(error);
  }
});

// GET /courseTypes/:id
app.get("/courseTypes/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute("SELECT * FROM courseTypes WHERE id = ?", [req.params.id]);
    connection.release();
    if (results.length === 0) {
      const error = new Error("Entity not found");
      error.type = "entity.not.found";
      return next(error);
    }
    res.json(results);
  } catch (e) {
    const error = new Error(e.message);

    if (e.code === "ER_BAD_DB_ERROR") {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }

    return next(error);
  }
});

// POST /courseTypes
//Catturo tutti i metodi HTTP per '/courseTypes'
app.all("/courseTypes", allowMethods(["POST"]));
app.post(
  "/courseTypes",
  //regole di validazione
  [check("name").isString().withMessage("Name must be a string").isLength({ min: 1 }).withMessage("Name cannot be empty")],
  async (req, res, next) => {
    //controllo se ci sono errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation error");
      error.type = "validation.error";
      error.details = errors.array();
      return next(error);
    }
    try {
      const connection = await pool.getConnection();
      const [results] = await connection.execute("INSERT INTO courseTypes (name) VALUES (?)", [req.body.name]);
      connection.release();
      res.status(201).json(results);
    } catch (e) {
      const error = new Error(e.message);

      if (e.code === "ER_BAD_DB_ERROR") {
        error.type = "service.unavailable";
        error.details = e.message;
      } else {
        error.type = "database.error";
        error.details = e.message;
      }

      return next(error);
    }
  }
);

//Requisito 2 - Corsi
// GET /courses
app.get("/courseTypes", async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute("SELECT * FROM courseTypes");
    connection.release();

    if (results.length === 0) {
      const error = new Error("No course types found");
      error.type = "entity.not.found";
      return next(error);
    }

    res.json(results);
  } catch (e) {
    const error = new Error(e.message);

    if (e.code === "ER_BAD_DB_ERROR") {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }

    return next(error);
  }
});

// GET /courses/:id
app.get("/courses/:id", async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute("SELECT * FROM courses WHERE id = ?", [req.params.id]);
    connection.release();

    if (results.length === 0) {
      const error = new Error("Course not found");
      error.type = "entity.not.found";
      return next(error);
    }

    res.json(results);
  } catch (e) {
    const error = new Error(e.message);

    if (e.code === "ER_BAD_DB_ERROR") {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }

    return next(error);
  }
});

// POST /courses
app.all("/courses", allowMethods(["POST"]));
app.post(
  "/courses",
  [
    // Regole di validazione qui
    check("name").isString().withMessage("Name must be a string").isLength({ min: 1 }).withMessage("Name cannot be empty"),
    check("idType").isInt().withMessage("idType must be an integer"),
  ],
  async (req, res, next) => {
    // Controllo se ci sono errori di validazione
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation error");
      error.type = "validation.error";
      error.details = errors.array();
      return next(error);
    }

    try {
      const connection = await pool.getConnection();
      const [results] = await connection.execute("INSERT INTO courses (name, idType) VALUES (?, ?)", [req.body.name, req.body.idType]);
      connection.release();
      res.status(201).json(results);
    } catch (e) {
      const error = new Error(e.message);

      if (e.code === "ER_BAD_DB_ERROR") {
        error.type = "service.unavailable";
        error.details = e.message;
      } else {
        error.type = "database.error";
        error.details = e.message;
      }

      return next(error);
    }
  }
);

// PUT /courses/:id
app.all("/courses/:id", allowMethods(["PUT"]));
app.put("/courses/:id", [check("name").isString().withMessage("Name must be a string").isLength({ min: 1 }).withMessage("Name cannot be empty"), check("idType").isInt().withMessage("idType must be an integer")], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation error");
    error.type = "validation.error";
    error.details = errors.array();
    return next(error);
  }

  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute("UPDATE courses SET name = ? , idType = ? WHERE id = ?", [req.body.name, req.body.idType, req.params.id]);
    connection.release();
    res.status(201).json(results);
  } catch (e) {
    const error = new Error(e.message);

    if (e.code === "ER_BAD_DB_ERROR") {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }

    return next(error);
  }
});

// DELETE /courses/:id
app.delete("/courses/:id", async (req, res, next) => {
  try {
    const connection = await pool.getConnection();

    // Prima verifico se il corso esiste
    const [checkResults] = await connection.execute("SELECT * FROM courses WHERE id = ?", [req.params.id]);

    if (checkResults.length === 0) {
      const error = new Error("Entity not found");
      error.type = "entity.not.found";
      return next(error);
    }

    // Elimino prima tutte le associazioni nella tabella course_university
    await connection.execute("DELETE FROM course_university WHERE course_id = ?", [req.params.id]);

    // Ora elimino il corso
    const [results] = await connection.execute("DELETE FROM courses WHERE id = ?", [req.params.id]);

    connection.release();
    res.json(results);
  } catch (e) {
    const error = new Error(e.message);
    if (e.code === "ER_BAD_DB_ERROR") {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }
    return next(error);
  }
});

//Requisito 3 - Atenei
// GET /universities
app.get("/universities", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute("SELECT * FROM universities");
    connection.release();

    if (results.length === 0) {
      const error = new Error("Entity not found");
      error.type = "entity.not.found";
      return next(error);
    }
    res.status(201).json(results);
  } catch (e) {
    const error = new Error(e.message);

    if (e.code === "ER_BAD_DB_ERROR") {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }

    return next(error);
  }
});

// GET /universities/:id
app.get("/universities/:id", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute("SELECT * FROM universities WHERE id = ?", [req.params.id]);
    connection.release();
    if (results.length === 0) {
      const error = new Error("Entity not found");
      error.type = "entity.not.found";
      return next(error);
    }
    res.status(201).json(results);
  } catch (e) {
    const error = new Error(e.message);

    if (e.code === "ER_BAD_DB_ERROR") {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }

    return next(error);
  }
});

// POST /universities
app.all("/universities", allowMethods(["POST"]));
app.post("/universities", [check("name").isString().withMessage("Name must be a string").isLength({ min: 1 }).withMessage("Name cannot be empty")], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation error");
    error.type = "validation.error";
    error.details = errors.array();
    return next(error);
  }
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute("INSERT INTO universities (name) VALUES (?)", [req.body.name]);
    connection.release();
    res.status(201).json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /universities/:id
app.all("/universities/:id", allowMethods(["PUT"]));
app.put("/universities/:id", [check("name").isString().withMessage("Name must be a string").isLength({ min: 1 }).withMessage("Name cannot be empty")], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation error");
    error.type = "validation.error";
    error.details = errors.array();
    return next(error);
  }
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute("UPDATE universities SET name = ? WHERE id = ?", [req.body.name, req.params.id]);
    connection.release();
    res.status(201).json(results);
  } catch (e) {
    const error = new Error(e.message);

    if (e.code === "ER_BAD_DB_ERROR") {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }

    return next(error);
  }
});

// DELETE /universities/:id
app.delete("/courses/:id", 
  [check("name").isString().withMessage("Name must be a string")
  .isLength({ min: 1 }).withMessage("Name cannot be empty")],
async (req, res, next) => {
  try {
    const connection = await pool.getConnection();

    // Prima verifico se il corso esiste
    const [checkResults] = await connection.execute("SELECT * FROM courses WHERE id = ?", [req.params.id]);

    if (checkResults.length === 0) {
      const error = new Error("Entity not found");
      error.type = "entity.not.found";
      return next(error);
    }

    // Elimino prima tutte le associazioni nella tabella course_university
    await connection.execute("DELETE FROM course_university WHERE course_id = ?", [req.params.id]);

    // Ora elimino il corso
    const [results] = await connection.execute("DELETE FROM courses WHERE id = ?", [req.params.id]);

    connection.release();
    res.json(results);
  } catch (e) {
    const error = new Error(e.message);
    if (e.code === "ER_BAD_DB_ERROR") {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }
    return next(error);
  }
});

//Requisito 4 - Associazione Corsi-Atenei
// POST /associateCourseToUniversity
app.all("/associateCourseToUniversity", allowMethods(["POST"]));
app.post("/associateCourseToUniversity", [check("course_id").isInt().withMessage("course_id must be an integer"), check("university_id").isInt().withMessage("university_id must be an integer")], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation error");
    error.type = "validation.error";
    error.details = errors.array();
    return next(error);
  }
  try {
    const connection = await pool.getConnection();
    await connection.execute("INSERT INTO course_university (course_id, university_id) VALUES (?, ?)", [req.body.course_id, req.body.university_id]);
    connection.release();
    res.status(201).json({ message: "Association successful", results: results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Requisito 5 - Visualizzare tutti i corsi e gli atenei associati + filtro per nome e tipo corso
// GET /coursesAndUniversities
app.get("/coursesAndUniversities", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(`
      SELECT courses.name AS course_name, universities.name AS university_name
      FROM course_university
      JOIN courses ON course_university.course_id = courses.id
      JOIN universities ON course_university.university_id = universities.id
    `);
    connection.release();
    if (results.length === 0) {
      const error = new Error("Entity not found");
      error.type = "entity.not.found";
      return next(error);
    }

    res.status(201).json(results);
  } catch (e) {
    const error = new Error(e.message);

    if (e.code === "ER_BAD_DB_ERROR") {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }

    return next(error);
  }
});

// GET /coursesAndUniversities
app.get("/coursesAndUniversities", async (req, res, next) => {
  if (typeof req.query.courseName !== 'undefined' 
  && typeof req.query.courseName !== 'string') {
    const error = new Error("Invalid courseName parameter");
    error.type = "validation.error";
    return next(error);
  }
  
  if (typeof req.query.courseType !== 'undefined' 
  && typeof req.query.courseType !== 'string') {
    const error = new Error("Invalid courseType parameter");
    error.type = "validation.error";
    return next(error);
  }

  let query = `
    SELECT courses.name AS course_name, universities.name AS university_name, courseTypes.name AS course_type
    FROM course_university
    JOIN courses ON course_university.course_id = courses.id
    JOIN universities ON course_university.university_id = universities.id
    JOIN courseTypes ON courses.idType = courseTypes.id
  `;

  const filters = [];
  if (req.query.courseName) {
    filters.push(`courses.name LIKE '%${req.query.courseName}%'`);
  }
  if (req.query.courseType) {
    filters.push(`courseTypes.name LIKE '%${req.query.courseType}%'`);
  }

  if (filters.length > 0) {
    query += " WHERE " + filters.join(" AND ");
  }

  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(query);
    connection.release();
    res.json(results);
  } catch (e) {
    const error = new Error(e.message);
    if (e.code === 'ER_BAD_DB_ERROR') {
      error.type = "service.unavailable";
      error.details = e.message;
    } else {
      error.type = "database.error";
      error.details = e.message;
    }
    return next(error);
  }
});


// Middleware per la gestione degli errori
app.use((err, req, res, next) => {
  if (err.type === "entity.not.found") {
    return res.status(404).json({ error: "Resource not found" });
  }
  if (err.type === "validation.error") {
    return res.status(400).json({ error: "Validation error", details: err.details });
  }
  if (err.type === "database.error") {
    return res.status(500).json({ error: "Database error" });
  }

  // Gestione di tutti gli altri errori non specifici
  return res.status(500).json({ error: "Internal Server Error" });
});
module.exports = app;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
