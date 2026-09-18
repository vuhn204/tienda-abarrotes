const productosModel = require('./productos.model');

// Devuelve todos los productos activos
async function getAll(req, res, next) {
  try {
    const productos = await productosModel.findAll();
    res.json(productos);
  } catch (error) {
    next(error);
  }
}

// Busca un producto por id, devuelve 404 si no existe
async function getById(req, res, next) {
  try {
    const producto = await productosModel.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    next(error);
  }
}

// Crea un producto nuevo, validando los campos mínimos
async function create(req, res, next) {
  try {
    const { nombre, categoria } = req.body;
    const precioUnit = req.body.precioUnit ?? req.body.precio_unit;
    if (!nombre || !categoria || !precioUnit) {
      return res.status(400).json({ mensaje: 'nombre, categoria y precioUnit (o precio_unit) son obligatorios' });
    }
    const nuevoProducto = await productosModel.create(req.body);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    next(error);
  }
}

// Actualiza un producto existente
async function update(req, res, next) {
  try {
    const producto = await productosModel.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    const productoActualizado = await productosModel.update(req.params.id, req.body);
    res.json(productoActualizado);
  } catch (error) {
    next(error);
  }
}

// Baja lógica: no borra el registro, solo lo marca como inactivo
async function remove(req, res, next) {
  try {
    const eliminado = await productosModel.remove(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };