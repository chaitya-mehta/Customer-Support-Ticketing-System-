const Notification = require('../models/Notification');
const { addNotificationJob } = require('../queues/notificationQueue');
const { successMessages, errorMessages } = require('../constants/common');

exports.createNotification = async (notificationData) => {
  try {
    const data = await addNotificationJob(notificationData);

    return {
      success: true,
      message: successMessages.NOTIFICATION_QUEUED_SUCCESS,
      notification: { queued: true, ...notificationData }
    };
  } catch (error) {
    throw new Error(errorMessages.NOTIFICATION_QUEUE_FAILED);
  }
};

exports.getUserNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ userId, read: false }).sort({ createdAt: -1 });
    return notifications;
  } catch (error) {
    throw new Error(errorMessages.NOTIFICATION_QUEUE_FAILED);
  }
};

exports.markAllAsRead = async (userId) => {
  try {
    const result = await Notification.updateMany(
      { userId: userId, read: false },
      { $set: { read: true } }
    );

    return {
      modifiedCount: result.modifiedCount,
      success: true
    };
  } catch (error) {
    throw new Error(errorMessages.MARK_READ_FAILED);
  }
};
