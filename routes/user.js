const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { updateUserSchema } = require('../validations/userValidation');

const router = express.Router();

router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, validateRequest(updateUserSchema), updateUser);
router.patch('/:id/status', protect, toggleUserStatus);
module.exports = router;
