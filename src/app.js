const express = require('express');
const cors = require('cors');

const clientesRoutes = require('./clientes/clientes.routes');
const productosRoutes = require('./productos/productos.routes');
const ventasRoutes = require('./ventas/ventas.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ estado: 'ok' });
});

app.use('/api/clientes', clientesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ mensaje: 'Ya existe un registro con ese valor unico (por ejemplo, el DNI)' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    const campo = String(err.sqlMessage || '');
    const mensaje = campo.includes('cliente_id') ? 'Cliente no encontrado' : 'El registro referenciado no existe';
    return res.status(404).json({ mensaje });
  }
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

module.exports = app;