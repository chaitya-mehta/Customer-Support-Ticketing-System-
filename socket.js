const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const redis = require('./lib/redisClient');

function initSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  const pub = redis.duplicate();
  const sub = redis.duplicate();
  io.adapter(createAdapter(pub, sub));

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.emit('connect1', { msg: 'Backend says hi!' });

    socket.on('join-user-room', (userId) => {
      console.log(`User ${userId} is joining their room`);
      socket.join(`user:${userId}`);
    });
    // Move the search-movies event handler inside the connection callback
    // socket.on('search-movies', (query) => {
    //   console.log('Searching movies with query:', query);

    //   // Simulate movie data based on query
    //   const data = [
    //     `Movie related to: ${query}`,
    //     `Another movie: ${query}`,
    //     `Movie 3 for: ${query}`
    //   ];

    //   console.log('Emitting movies list');
    //   // Send back to the specific client that made the request
    //   socket.emit('movies-list', data);

    //   // Or if you want to broadcast to all clients:
    //   // io.emit('movies-list', data);
    // });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
  return io;
}
function sendNotificationToUser(io, userId, notificationData) {
  io.to(`user:${userId}`).emit('new-notification', notificationData);
  console.log(`Notification sent to user ${userId}:`, notificationData);
}

function sendNotificationToAll(io, notificationData) {
  io.emit('new-notification', notificationData);
  console.log('Notification sent to all users:', notificationData);
}
module.exports = { initSocket, sendNotificationToAll, sendNotificationToUser };
