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
  const { nombre, categoria, descripcion, stock } = producto;
  const precioUnit = producto.precioUnit ?? producto.precio_unit;
  const fechaProduccion = producto.fechaProduccion ?? producto.fecha_produccion;
  const fechaCaducidad = producto.fechaCaducidad ?? producto.fecha_caducidad;
  const [result] = await pool.query(
    `INSERT INTO productos (nombre, categoria, descripcion, precio_unit, stock, fecha_produccion, fecha_caducidad)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nombre, categoria, descripcion || null, precioUnit, stock || 0, fechaProduccion || null, fechaCaducidad || null]
  );
  return findById(result.insertId);
}

async function update(id, producto) {
  const { nombre, categoria, descripcion, stock } = producto;
  const precioUnit = producto.precioUnit ?? producto.precio_unit;
  const fechaProduccion = producto.fechaProduccion ?? producto.fecha_produccion;
  const fechaCaducidad = producto.fechaCaducidad ?? producto.fecha_caducidad;
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