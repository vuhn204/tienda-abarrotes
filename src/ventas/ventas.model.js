// El modelo es la unica capa que habla SQL directo. El controller nunca toca `pool`.
const { pool } = require('../db/connection');

// GET /api/ventas -> trae todas las ventas (incluye anuladas; el controller puede filtrar si se pide)
async function findAll() {
  const [rows] = await pool.query(
    `SELECT * FROM ventas ORDER BY creado_en DESC`
  );
  return rows;
}

// GET /api/ventas/:id -> trae una venta puntual
async function findById(id) {
  const [rows] = await pool.query(
    `SELECT * FROM ventas WHERE id = ?`,
    [id]
  );
  return rows[0]; 
}

// POST /api/ventas -> crea una venta y descuenta stock del producto, todo en una transaccion
async function create({ cliente_id, producto_id, cantidad }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [productos] = await connection.query(
      `SELECT id, nombre, precio_unit, stock FROM productos WHERE id = ? FOR UPDATE`,
      [producto_id]
    );
    const producto = productos[0];

    if (!producto) {
      await connection.rollback();
      
      const error = new Error('Producto no encontrado');
      error.status = 404;
      throw error;
    }

    if (producto.stock < cantidad) {
      await connection.rollback();
      const error = new Error(`Stock insuficiente. Disponible: ${producto.stock}`);
      error.status = 400;
      throw error;
    }

    const precio_unitario = producto.precio_unit;
    const total = Number((precio_unitario * cantidad).toFixed(2));

    const [resultVenta] = await connection.query(
      `INSERT INTO ventas
        (cliente_id, producto_id, nombre_producto, cantidad, precio_unitario, total, estado)
       VALUES (?, ?, ?, ?, ?, ?, 'completada')`,
      [cliente_id, producto_id, producto.nombre, cantidad, precio_unitario, total]
    );

    await connection.query(
      `UPDATE productos SET stock = stock - ? WHERE id = ?`,
      [cantidad, producto_id]
    );

    await connection.commit();

    return findById(resultVenta.insertId);
  } catch (error) {

    await connection.rollback();
    throw error;
  } finally {
    connection.release(); 
  }
}

// PATCH /api/ventas/:id/anular -> baja logica: pasa el estado a 'anulada'
async function anular(id) {
  const [result] = await pool.query(
    `UPDATE ventas SET estado = 'anulada' WHERE id = ? AND estado != 'anulada'`,
    [id]
  );
  return result.affectedRows > 0; 
}

module.exports = { findAll, findById, create, anular };