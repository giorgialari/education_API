const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config();

const PORT = process.env.PORT || 3000;

//crea una connessione al DB - TODO - spostare in un file env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
});


//Requisito 1 - Tipologia corsi
// GET /courseTypes
app.get('/courseTypes', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute('SELECT * FROM courseTypes');
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /courseTypes/:id
app.get('/courseTypes/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      'SELECT * FROM courseTypes WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /courseTypes
app.post('/courseTypes', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      'INSERT INTO courseTypes (name) VALUES (?)',
      [req.body.name]
    );
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Requisito 2 - Corsi
// GET /courses
app.get('/courses', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute('SELECT * FROM courses');
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /courses/:id
app.get('/courses/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      'SELECT * FROM courses WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /courses
app.post('/courses', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      'INSERT INTO courses (name, idType) VALUES (?, ?)',
      [req.body.name, req.body.idType]
    );
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /courses/:id
app.put('/courses/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      'UPDATE courses SET name = ? , idType = ? WHERE id = ?',
      [req.body.name, req.body.idType, req.params.id]
    );
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /courses/:id
app.delete('/courses/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Elimino prima tutte le associazioni nella tabella course_university
    await connection.execute(
      'DELETE FROM course_university WHERE course_id = ?',
      [req.params.id]
    );

    // Ora elimino il corso
    const [results] = await connection.execute(
      'DELETE FROM courses WHERE id = ?',
      [req.params.id]
    );

    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Requisito 3 - Atenei
// GET /universities
app.get('/universities', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute('SELECT * FROM universities');
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /universities/:id
app.get('/universities/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      'SELECT * FROM universities WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /universities
app.post('/universities', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      'INSERT INTO universities (name) VALUES (?)',
      [req.body.name]
    );
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /universities/:id
app.put('/universities/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      'UPDATE universities SET name = ? WHERE id = ?',
      [req.body.name, req.params.id]
    );
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /universities/:id
app.delete('/universities/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(
      'DELETE FROM universities WHERE id = ?',
      [req.params.id]
    );
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//Requisito 4 - Associazione Corsi-Atenei
// POST /associateCourseToUniversity
app.post('/associateCourseToUniversity', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO course_university (course_id, university_id) VALUES (?, ?)',
      [req.body.course_id, req.body.university_id]
    );
    connection.release();
    res.json({ message: 'Association successful' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Requisito 5 - Visualizzare tutti i corsi e gli atenei associati + filtro per nome e tipo corso
// GET /coursesAndUniversities
app.get('/coursesAndUniversities', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(`
      SELECT courses.name AS course_name, universities.name AS university_name
      FROM course_university
      JOIN courses ON course_university.course_id = courses.id
      JOIN universities ON course_university.university_id = universities.id
    `);
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /coursesAndUniversities
app.get('/coursesAndUniversities', async (req, res) => {
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
    query += ' WHERE ' + filters.join(' AND ');
  }

  try {
    const connection = await pool.getConnection();
    const [results] = await connection.execute(query);
    connection.release();
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = app;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
