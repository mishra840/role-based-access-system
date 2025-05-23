const express = require('express');
const router = express.Router();
const enterpriseController = require('../controllers/enterpriseController');

router.post('/', enterpriseController.createEnterprise);
router.get('/', enterpriseController.getEnterprises);
router.get('/:id', enterpriseController.getEnterpriseById);
router.put('/:id', enterpriseController.updateEnterprise);
router.delete('/:id', enterpriseController.deleteEnterprise);

module.exports = router;
