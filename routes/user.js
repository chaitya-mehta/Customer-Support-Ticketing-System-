const express = require('express');
const { getAllUsers, getUserById, updateUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { updateUserSchema } = require('../validations/userValidation');

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', protect, validateRequest(updateUserSchema), updateUser);

module.exports = router;
