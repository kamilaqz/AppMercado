const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

router.get('/', favoriteController.listAll);
router.post('/', favoriteController.create);
router.delete('/:id', favoriteController.delete);

module.exports = router;