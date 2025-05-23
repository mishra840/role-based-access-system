// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// router.get('/:id', userController.getUserById); // admin or self
// router.put('/:id', userController.updateUser); // admin or self
// // router.delete('/:id', authorizeRoles('Admin'), userController.deleteUser);

// module.exports = router;

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { authenticate, authorizeAdmin, authorizeAdminOrSelf } = require('../middlewares/authMiddleware');

router.use(authenticate);
// Current user info route


router.get('/current', authenticate, userController.getCurrentUser);
router.get('/:userId', userController.getUserModules);

router.get('/', authorizeAdmin, userController.getUsers);
router.get('/:id', authorizeAdminOrSelf, userController.getUserById);
router.post('/', authorizeAdmin, userController.createUser);
router.put('/:id', authorizeAdminOrSelf, userController.updateUser);
router.delete('/:id', authorizeAdmin, userController.deleteUser);
router.post('/users/:id/assignmodules', userController.assignModulesToUser);

// GET assigned modules for a user


module.exports = router;
