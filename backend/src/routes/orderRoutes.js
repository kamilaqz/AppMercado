const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');

router.post('/', orderController.finalizeOrder);
router.get('/', orderController.getFinishedOrders);

module.exports = router;