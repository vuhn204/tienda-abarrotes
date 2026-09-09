// Este archivo define las URLs del modulo de clientes y las conecta con su controller.
const { Router } = require('express');
const clientesController = require('./clientes.controller');

const router = Router();

// Cada linea mapea: metodo HTTP + ruta -> funcion del controller
router.get('/', clientesController.getAll);       // Listar todos
router.get('/:id', clientesController.getById);    // Obtener uno por id
router.post('/', clientesController.create);       // Crear uno nuevo
router.put('/:id', clientesController.update);      // Actualizar uno existente
router.delete('/:id', clientesController.remove);   // Baja logica

// Este router se monta luego en app.js bajo el prefijo /api/clientes
module.exports = router;