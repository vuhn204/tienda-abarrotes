// Carga las variables de entorno antes que cualquier otra cosa
require('dotenv').config();

const app = require('./app');
const { testConnection } = require('./db/connection');

const PORT = process.env.PORT || 3000;

// Este es el unico archivo que realmente "prende" el servidor (app.listen).
// Separarlo de app.js permite testear la app sin necesidad de abrir un puerto real.
app.listen(PORT, async () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  await testConnection(); // Verifica la conexion a MySQL apenas arranca
});