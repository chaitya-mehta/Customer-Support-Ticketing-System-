const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  payload: {
    type: Object,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);
