const pool = require('../db');

// Get all courses
exports.getAllCourses = async () => {
  const connection = await pool.getConnection();
  const [results] = await connection.execute("SELECT * FROM courses");
  connection.release();
  return results;
};

// Get a single course by ID
exports.getCourseById = async (id) => {
  const connection = await pool.getConnection();
  const [results] = await connection.execute("SELECT * FROM courses WHERE id = ?", [id]);
  connection.release();
  if (results.length === 0) {
    return null;
  }
  return results[0];
};

// Create a new course
exports.createCourse = async (name, idType) => {
  const connection = await pool.getConnection();
  const [results] = await connection.execute("INSERT INTO courses (name, idType) VALUES (?, ?)", [name, idType]);
  connection.release();
  return results;
};

// Update a course by ID
exports.updateCourse = async (id, name, idType) => {
  const connection = await pool.getConnection();
  const [results] = await connection.execute("UPDATE courses SET name = ?, idType = ? WHERE id = ?", [name, idType, id]);
  connection.release();
  return results;
};

// Delete a course by ID
exports.deleteCourse = async (id) => {
  const connection = await pool.getConnection();

  // Delete associations from the course_university table
  await connection.execute("DELETE FROM course_university WHERE course_id = ?", [id]);

  // Delete the course
  const [results] = await connection.execute("DELETE FROM courses WHERE id = ?", [id]);

  connection.release();
  return results;
};

// Check if a course exists by ID
exports.courseExists = async (id) => {
  const course = await this.getCourseById(id);
  return course !== null;
};
