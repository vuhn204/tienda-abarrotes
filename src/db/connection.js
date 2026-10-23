const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

function buildSsl() {
  if (process.env.DB_SSL !== 'true') {
    return undefined;
  }

  let ca;

  if (process.env.DB_SSL_CA) {
    ca = process.env.DB_SSL_CA.replace(/\\n/g, '\n');
  } else if (process.env.DB_SSL_CA_PATH) {
    ca = fs.readFileSync(
      path.resolve(process.env.DB_SSL_CA_PATH),
      'utf8'
    );
  } else {
    throw new Error(
      'DB_SSL=true requiere DB_SSL_CA o DB_SSL_CA_PATH'
    );
  }

  return {
    ca,
    rejectUnauthorized: true
  };
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tienda_abarrotes',
  ssl: buildSsl(),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  let connection;

  try {
    connection = await pool.getConnection();
    console.log('Conexion a MySQL establecida correctamente.');
  } catch (error) {
    console.error('Error al conectar a MySQL:', error.message);
    process.exitCode = 1;
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

module.exports = { pool, testConnection };
