const express = require('express');
const { protect } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const { registerSchema, loginSchema } = require('../validations/authValidation');

const { register, getCurrentUser, login } = require('../controllers/authController');

const router = express.Router();

router.post('/users', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/getCurrentUser', protect, getCurrentUser);

module.exports = router;
