const express = require('express');
const router = express.Router();
const userController = require('../controller/auth.controller');
router.post('/users/signup', userController.createUser);
router.post('/users/login', userController.loginUser);
router.get('/users', userController.getUser);
router.post('/sentotp', userController.requestPasswordReset);
router.post('/verifyotp', userController.verifyOTPAndResetPassword);

module.exports = router;