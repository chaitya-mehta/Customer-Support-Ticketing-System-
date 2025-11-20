const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

router.post('/', protect, notificationController.createNotification);
router.get('/', protect, notificationController.getUserNotifications);
router.put('/mark-as-read', protect, notificationController.markAllAsRead);
module.exports = router;