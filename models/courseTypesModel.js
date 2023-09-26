const pool = require('../db');

// Get all course types
exports.getAllCourseTypes = async () => {
  const connection = await pool.getConnection();
  const [results] = await connection.execute("SELECT * FROM courseTypes");
  connection.release();
  return results;
};

// Get a single course type by ID
exports.getCourseTypeById = async (id) => {
  const connection = await pool.getConnection();
  const [results] = await connection.execute("SELECT * FROM courseTypes WHERE id = ?", [id]);
  connection.release();
  if (results.length === 0) {
    return null;
  }
  return results[0];
};

// Create a new course type
exports.createCourseType = async (name) => {
  const connection = await pool.getConnection();
  const [results] = await connection.execute("INSERT INTO courseTypes (name) VALUES (?)", [name]);
  connection.release();
  return results;
};
