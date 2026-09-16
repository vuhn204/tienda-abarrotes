const express = require('express');
const ventasController = require('./ventas.controller');
 
const router = express.Router();
 
router.get('/', ventasController.getAll);
router.get('/:id', ventasController.getById);
router.post('/', ventasController.create);
router.patch('/:id/anular', ventasController.anular);
 
module.exports = router;
 
