const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  toggleUserStatus,
  getAllAgents
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { updateUserSchema } = require('../validations/userValidation');

const router = express.Router();

router.get('/agent-list', protect, getAllAgents);
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, validateRequest(updateUserSchema), updateUser);
router.patch('/:id/status', protect, authorize('admin'), toggleUserStatus);
module.exports = router;
