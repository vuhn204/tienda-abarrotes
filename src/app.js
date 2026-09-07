const express = require('express');
const cors = require('cors');

const clientesRoutes = require('./clientes/clientes.routes');
// const productosRoutes = require('./productos/productos.routes'); // pendiente
// const ventasRoutes = require('./ventas/ventas.routes'); // pendiente

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ estado: 'ok' });
});

app.use('/api/clientes', clientesRoutes);
// app.use('/api/productos', productosRoutes);
// app.use('/api/ventas', ventasRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejador de errores centralizado
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

module.exports = app;