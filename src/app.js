const express = require('express');
const cors = require('cors');

// Rutas del modulo de clientes (los otros modulos se agregaran despues)
const clientesRoutes = require('./clientes/clientes.routes');
// const productosRoutes = require('./productos/productos.routes'); // pendiente
// const ventasRoutes = require('./ventas/ventas.routes'); // pendiente

const app = express();

app.use(cors());          // Permite que un frontend en otro origen consuma esta API
app.use(express.json());  // Permite leer JSON del body de las peticiones (req.body)

// Endpoint simple para confirmar que el servidor esta vivo
app.get('/health', (req, res) => {
  res.json({ estado: 'ok' });
});

// Se monta el router de clientes bajo el prefijo /api/clientes
app.use('/api/clientes', clientesRoutes);
// app.use('/api/productos', productosRoutes);
// app.use('/api/ventas', ventasRoutes);

// Si ninguna ruta anterior coincidio, se responde 404 en JSON
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejador de errores centralizado.
// Express reconoce una funcion con 4 parametros (err, req, res, next) como manejador de errores.
// Cualquier next(error) en los controllers termina cayendo aqui.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

module.exports = app;