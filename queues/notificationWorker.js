const { Worker } = require('bullmq');
const redis = require('../lib/redisClient');
const Notification = require('../models/Notification');
const { sendNotificationToUser } = require('../socket');

function startNotificationWorker(io) {
  const worker = new Worker(
    'notification-queue',
    async (job) => {
      const { type, payload, userId } = job.data;
      const saved = await Notification.create({ type, payload, userId });
      if (userId) {
        console.log(`Sending notification to user ${userId}`);
        sendNotificationToUser(io, userId, saved);
        // io.emit('new-notification', saved);
      } else {
        io.emit('new-notification', saved);
      }
      return true;
    },
    { connection: redis }
  );

  console.log('[BullMQ] Worker ready');
  return worker;
}

module.exports = { startNotificationWorker };
