const { Router } = require('express');
const productosController = require('./productos.controller');

const router = Router();

// Rutas CRUD del módulo de productos
router.get('/', productosController.getAll);
router.get('/:id', productosController.getById);
router.post('/', productosController.create);
router.put('/:id', productosController.update);
router.delete('/:id', productosController.remove);

module.exports = router;