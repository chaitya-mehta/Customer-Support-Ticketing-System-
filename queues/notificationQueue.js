const { Queue } = require('bullmq');
const redis = require('../lib/redisClient');

const notificationQueue = new Queue('notification-queue', {
  connection: redis
});

async function addNotificationJob(data) {
  await notificationQueue.add('send-notification', data, {
    attempts: 3,
    removeOnComplete: 20,
    removeOnFail: 50
  });
}

module.exports = { notificationQueue, addNotificationJob };
