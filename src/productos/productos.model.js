const { pool } = require('../db/connection');

async function findAll() {
  const [rows] = await pool.query(
    'SELECT * FROM productos WHERE activo = TRUE ORDER BY id DESC'
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
  return rows[0] || null; 
}

async function create(producto) {
  const { nombre, categoria, descripcion, precioUnit, stock, fechaProduccion, fechaCaducidad } = producto;
  const [result] = await pool.query(
    `INSERT INTO productos (nombre, categoria, descripcion, precio_unit, stock, fecha_produccion, fecha_caducidad)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, categoria, descripcion || null, precioUnit, stock || 0, fechaProduccion || null, fechaCaducidad || null]
  );
  return findById(result.insertId);
}

async function update(id, producto) {
  const { nombre, categoria, descripcion, precioUnit, stock, fechaProduccion, fechaCaducidad } = producto;
  await pool.query(
    `UPDATE productos
     SET nombre = ?, categoria = ?, descripcion = ?, precio_unit = ?, stock = ?, fecha_produccion = ?, fecha_caducidad = ?
     WHERE id = ?`,
    [nombre, categoria, descripcion || null, precioUnit, stock || 0, fechaProduccion || null, fechaCaducidad || null, id]
  );
  return findById(id); 
}

async function remove(id) {
  const [result] = await pool.query(
    'UPDATE productos SET activo = FALSE WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };