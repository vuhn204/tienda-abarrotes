// El modelo es la unica capa que habla directamente con la base de datos.
// No conoce nada de Express (req/res); solo recibe datos y devuelve datos.
const { pool } = require('../db/connection');

// Devuelve todos los clientes que esten activos (no se muestran los dados de baja)
async function findAll() {
  const [rows] = await pool.query(
    'SELECT * FROM clientes WHERE activo = TRUE ORDER BY id DESC'
  );
  return rows;
}

// Busca un cliente puntual por su id.
// Usa "?" como placeholder para evitar inyeccion SQL (nunca concatenar el id directo en el string)
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
  return rows[0] || null; // Si no existe, regresa null en vez de un arreglo vacio
}

// Inserta un nuevo cliente en la tabla
async function create(cliente) {
  const { nombre, apellido, dni, telefono, email, direccion } = cliente;
  const [result] = await pool.query(
    `INSERT INTO clientes (nombre, apellido, dni, telefono, email, direccion)
     VALUES (?, ?, ?, ?, ?, ?)`,
    // Los campos opcionales se mandan como null si no vienen en el request
    [nombre, apellido, dni || null, telefono || null, email || null, direccion || null]
  );
  // result.insertId trae el id autogenerado por MySQL para la fila nueva
  return findById(result.insertId);
}

// Actualiza los datos de un cliente existente
async function update(id, cliente) {
  const { nombre, apellido, dni, telefono, email, direccion } = cliente;
  await pool.query(
    `UPDATE clientes
     SET nombre = ?, apellido = ?, dni = ?, telefono = ?, email = ?, direccion = ?
     WHERE id = ?`,
    [nombre, apellido, dni || null, telefono || null, email || null, direccion || null, id]
  );
  return findById(id); // Devuelve el cliente ya actualizado
}

// "Elimina" un cliente, pero con baja logica (no borra la fila de verdad)
async function remove(id) {
  // Se marca activo = FALSE en vez de hacer DELETE, para no perder el historial
  // de ventas que pudiera estar asociado a este cliente en el futuro.
  const [result] = await pool.query(
    'UPDATE clientes SET activo = FALSE WHERE id = ?',
    [id]
  );
  // affectedRows > 0 confirma si de verdad existia una fila con ese id
  return result.affectedRows > 0;
}

module.exports = { findAll, findById, create, update, remove };