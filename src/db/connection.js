// Cliente de MySQL con soporte para promesas (permite usar async/await en vez de callbacks)
const mysql = require('mysql2/promise');

// Carga las variables de entorno definidas en el archivo .env (host, usuario, password, etc.)
require('dotenv').config();

// Se crea un "pool" de conexiones en vez de una conexión unica.
// Un pool mantiene varias conexiones abiertas y las reutiliza entre peticiones,
// lo cual es mucho mas eficiente que abrir/cerrar una conexion nueva por cada consulta.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',       // Direccion del servidor MySQL
  port: process.env.DB_PORT || 3306,               // Puerto por defecto de MySQL
  user: process.env.DB_USER || 'root',             // Usuario de la base de datos
  password: process.env.DB_PASSWORD || '',         // Password del usuario
  database: process.env.DB_NAME || 'tienda_abarrotes', // Nombre de la base de datos a usar
  waitForConnections: true,   // Si no hay conexiones libres, espera en vez de fallar de inmediato
  connectionLimit: 10,        // Maximo de conexiones simultaneas en el pool
  queueLimit: 0                // 0 = sin limite de peticiones esperando una conexion libre
});

// Funcion auxiliar para verificar que la conexion a MySQL funciona.
// Se usa una sola vez al arrancar el servidor (ver server.js).
async function testConnection() {
  try {
    const connection = await pool.getConnection(); // Pide una conexion prestada del pool
    console.log('Conexion a MySQL establecida correctamente.');
    connection.release(); // Muy importante: devolver la conexion al pool para que se reutilice
  } catch (error) {
    console.error('Error al conectar a MySQL:', error.message);
  }
}

// Se exporta el pool (para que los modelos hagan sus consultas) y testConnection (para el arranque)
module.exports = { pool, testConnection };