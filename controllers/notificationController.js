const { successMessages } = require('../constants/common');
const notificationService = require('../services/notificationService');

exports.createNotification = async (req, res, next) => {
  try {
    const { type, payload, userId } = req.body;

    const result = await notificationService.createNotification({ type, payload, userId });

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.notification
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationService.getUserNotifications(userId);

    res.status(200).json({
      success: true,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await notificationService.markAllAsRead(userId);

    res.status(200).json({
      success: true,
      message: successMessages.ALL_NOTIFICATIONS_MARKED_READ,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
