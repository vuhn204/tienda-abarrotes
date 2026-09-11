const mysql = require('mysql2/promise');

// Carga las variables de entorno definidas en el archivo .env (host, usuario, password, etc.)
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tienda_abarrotes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexion a MySQL establecida correctamente.');
    connection.release();
  } catch (error) {
    console.error('Error al conectar a MySQL:', error.message);
  }
}

module.exports = { pool, testConnection };