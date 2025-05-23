const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// const authMiddleware = require('../middlewares/authMiddleware');

// router.use(authMiddleware.verifyToken);

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
