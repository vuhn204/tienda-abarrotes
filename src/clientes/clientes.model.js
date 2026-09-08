const { pool } = require('../db/connection');

async function findAll() {
  const [rows] = await pool.query(
    'SELECT * FROM clientes WHERE activo = TRUE ORDER BY id DESC'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create(cliente) {
  const { nombre, apellido, dni, telefono, email, direccion } = cliente;
  const [result] = await pool.query(
    `INSERT INTO clientes (nombre, apellido, dni, telefono, email, direccion)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, apellido, dni || null, telefono || null, email || null, direccion || null]
  );
  return findById(result.insertId);
}

async function update(id, cliente) {
  const { nombre, apellido, dni, telefono, email, direccion } = cliente;
  await pool.query(
    `UPDATE clientes
     SET nombre = ?, apellido = ?, dni = ?, telefono = ?, email = ?, direccion = ?
     WHERE id = ?`,
    [nombre, apellido, dni || null, telefono || null, email || null, direccion || null, id]
  );
  return findById(id);
}

async function remove(id) {
  // Borrado logico para no perder historial de ventas asociado al cliente
  const [result] = await pool.query(
    'UPDATE clientes SET activo = FALSE WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };