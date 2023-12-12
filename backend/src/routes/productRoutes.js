const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.listAll);
router.get('/:id', productController.listById);
router.post('/', productController.create);
//router.put('/:id', produtoController.update);
//router.put('/', produtoController.cadastrarPromocao);
router.delete('/:id', productController.delete);

module.exports = router;