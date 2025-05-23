const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const authMiddleware = require('../middlewares/authMiddleware');

// router.use(authMiddleware.verifyToken);

router.post('/', moduleController.createModule);
router.get('/', moduleController.getModules);
router.get('/:id', moduleController.getModuleById);
router.put('/:id', moduleController.updateModule);
router.delete('/:id', moduleController.deleteModule);
// router.post('/users/:id/assignmodules', authMiddleware, moduleController.assignModulesToUser);

module.exports = router;
