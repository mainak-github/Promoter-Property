const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/users', authController.listusers);
router.get('/userDetails/:id', authController.userDetails);
router.delete('/deleteuser/:id', authController.deleteUser);
router.put('/updateUser/:id', authController.updateUser);
module.exports = router;
