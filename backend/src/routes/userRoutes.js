const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.listAll);
router.get('/:id', userController.listById);
router.post('/', userController.create);
router.post('/profile', userController.getUserProfile);
//router.put('/:id', userController.update);
//router.delete('/:id', userController.delete);

module.exports = router;