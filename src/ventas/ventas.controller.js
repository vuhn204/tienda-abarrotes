const ventasModel = require('./ventas.model');

// GET /api/ventas -> lista todas las ventas
async function getAll(req, res, next) {
  try {
    const ventas = await ventasModel.findAll();
    res.json(ventas);
  } catch (error) {
    next(error);
  }
}

// GET /api/ventas/:id -> trae una venta puntual
async function getById(req, res, next) {
  try {
    const venta = await ventasModel.findById(req.params.id);
    if (!venta) {
      return res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
    res.json(venta);
  } catch (error) {
    next(error);
  }
}

// POST /api/ventas -> registra una venta nueva y descuenta stock
async function create(req, res, next) {
  try {
    const { cliente_id, producto_id, cantidad } = req.body;

    if (!cliente_id || !producto_id || !cantidad) {
      return res.status(400).json({ mensaje: 'cliente_id, producto_id y cantidad son obligatorios' });
    }
    if (cantidad <= 0) {
      return res.status(400).json({ mensaje: 'cantidad debe ser mayor a 0' });
    }

    const nuevaVenta = await ventasModel.create({ cliente_id, producto_id, cantidad });
    res.status(201).json(nuevaVenta);
  } catch (error) {
  
    if (error.status) {
      return res.status(error.status).json({ mensaje: error.message });
    }
    next(error);
  }
}


async function anular(req, res, next) {
  try {
    const anulada = await ventasModel.anular(req.params.id);
    if (!anulada) {
      return res.status(404).json({ mensaje: 'Venta no encontrada o ya estaba anulada' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, anular };