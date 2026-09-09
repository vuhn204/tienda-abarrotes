// El controller conecta el mundo HTTP (req/res) con el modelo (que solo sabe de SQL).
const clientesModel = require('./clientes.model');

// GET /api/clientes -> lista todos los clientes activos
async function getAll(req, res, next) {
  try {
    const clientes = await clientesModel.findAll();
    res.json(clientes);
  } catch (error) {
    next(error); // Delega el error al manejador centralizado en app.js
  }
}

// GET /api/clientes/:id -> trae un cliente puntual
async function getById(req, res, next) {
  try {
    const cliente = await clientesModel.findById(req.params.id);
    if (!cliente) {
      // Si no existe, se responde 404 en vez de un 200 con null
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    next(error);
  }
}

// POST /api/clientes -> crea un cliente nuevo
async function create(req, res, next) {
  try {
    const { nombre, apellido } = req.body;
    // Validacion basica antes de tocar la base de datos
    if (!nombre || !apellido) {
      return res.status(400).json({ mensaje: 'nombre y apellido son obligatorios' });
    }
    const nuevoCliente = await clientesModel.create(req.body);
    res.status(201).json(nuevoCliente); // 201 = creado exitosamente
  } catch (error) {
    next(error);
  }
}

// PUT /api/clientes/:id -> actualiza un cliente existente
async function update(req, res, next) {
  try {
    // Primero se confirma que el cliente exista antes de intentar actualizarlo
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

// DELETE /api/clientes/:id -> baja logica de un cliente
async function remove(req, res, next) {
  try {
    const eliminado = await clientesModel.remove(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.status(204).send(); // 204 = exito, sin contenido que devolver
  } catch (error) {
    next(error);
  }
}

module.exports = { getAll, getById, create, update, remove };