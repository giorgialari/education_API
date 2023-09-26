const pool = require('../db');

exports.associateCourseToUniversity = async (course_id, university_id) => {
  const connection = await pool.getConnection();
  await connection.execute("INSERT INTO course_university (course_id, university_id) VALUES (?, ?)", [course_id, university_id]);
  connection.release();
  return { message: 'Association successful' };
};

exports.getCoursesAndUniversities = async (courseName, courseType) => {
  let query = `
      SELECT courses.name AS course_name, universities.name AS university_name, courseTypes.name AS course_type
      FROM course_university
      JOIN courses ON course_university.course_id = courses.id
      JOIN universities ON course_university.university_id = universities.id
      JOIN courseTypes ON courses.idType = courseTypes.id
    `;

  const filters = [];
  if (courseName) {
    filters.push(`courses.name LIKE '%${courseName}%'`);
  }
  if (courseType) {
    filters.push(`courseTypes.name LIKE '%${courseType}%'`);
  }

  if (filters.length > 0) {
    query += " WHERE " + filters.join(" AND ");
  }

  const connection = await pool.getConnection();
  const [results] = await connection.execute(query);
  connection.release();
  return results;
};

exports.checkExistingAssociation = async (course_id, university_id) => {
  const connection = await pool.getConnection();
  const [results] = await connection.execute("SELECT * FROM course_university WHERE course_id = ? AND university_id = ?", [course_id, university_id]);
  connection.release();
  return results.length !== 0;
};
