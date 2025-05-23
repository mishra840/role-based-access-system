const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/verify-token', authController.verifyToken);  // protected route

router.post('/register', authController.register);

router.post('/login', authController.login);
router.post('/logout', authController.logout);


module.exports = router;
