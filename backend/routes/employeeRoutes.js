const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
// const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// router.use(authenticateToken);

router.get('/', employeeController.getEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
