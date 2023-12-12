const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:email', userController.verificarUser);

module.exports = router;