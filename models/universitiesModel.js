const pool = require('../db');

exports.getAllUniversities = async () => {
  const connection = await pool.getConnection();
  const [results] = await connection.execute("SELECT * FROM universities");
  connection.release();
  return results;
};

exports.getUniversityById = async (id) => {
  const connection = await pool.getConnection();
  const [result] = await connection.execute("SELECT * FROM universities WHERE id = ?", [id]);
  connection.release();
  return result;
};

exports.createUniversity = async (name) => {
  const connection = await pool.getConnection();
  const [result] = await connection.execute("INSERT INTO universities (name) VALUES (?)", [name]);
  connection.release();
  return result;
};

exports.updateUniversity = async (id, name) => {
  const connection = await pool.getConnection();
  const [result] = await connection.execute("UPDATE universities SET name = ? WHERE id = ?", [name, id]);
  connection.release();
  return result;
};

exports.deleteUniversity = async (id) => {
  const connection = await pool.getConnection();
  const [result] = await connection.execute("DELETE FROM universities WHERE id = ?", [id]);
  connection.release();
  return result;
};
