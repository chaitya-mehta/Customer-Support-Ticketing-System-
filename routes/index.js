const express = require('express');
const authRoutes = require('./auth');
const userRoutes = require('./user');
const ticketRoutes = require('./tickets');
const categoryRoutes = require('./category');
const notificationRoutes = require('./notification');
// const commentRoutes = require("./comments");

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);
router.use('/category', categoryRoutes);
router.use('/notifications', notificationRoutes);
// router.use("/comments", commentRoutes);

module.exports = router;
