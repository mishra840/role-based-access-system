const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Routes for Role Management
router.post('/', roleController.createRole);
router.get('/', roleController.getRoles);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
