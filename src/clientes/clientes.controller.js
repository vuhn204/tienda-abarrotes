const clientesModel = require('./clientes.model');

async function getAll(req, res, next) {
  try {
    const clientes = await clientesModel.findAll();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const cliente = await clientesModel.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const { nombre, apellido } = req.body;
    if (!nombre || !apellido) {
      return res.status(400).json({ mensaje: 'nombre y apellido son obligatorios' });
    }
    const nuevoCliente = await clientesModel.create(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const cliente = await clientesModel.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    const clienteActualizado = await clientesModel.update(req.params.id, req.body);
    res.json(clienteActualizado);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const eliminado = await clientesModel.remove(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };