require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./db/connection');

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  await testConnection();
});