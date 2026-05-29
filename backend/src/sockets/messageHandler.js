const Message = require('../models/Message');
const Room = require('../models/Room');

const setupMessageHandlers = (io, socket) => {
  // Join room
  socket.on('join_room', async (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit('user_joined', {
      userId: socket.userId,
      message: `User ${socket.userId} joined the room`
    });
  });

  // Send message
  socket.on('send_message', async (data) => {
    try {
      const { content, roomId } = data;
      
      const message = new Message({
        content,
        sender: socket.userId,
        room: roomId
      });
      
      await message.save();
      await message.populate('sender');
      
      io.to(roomId).emit('receive_message', {
        _id: message._id,
        content: message.content,
        sender: message.sender,
        room: message.room,
        createdAt: message.createdAt
      });
    } catch (error) {
      socket.emit('error', error.message);
    }
  });

  // User typing
  socket.on('typing', (data) => {
    const { roomId, userName } = data;
    socket.broadcast.to(roomId).emit('user_typing', {
      userId: socket.userId,
      userName
    });
  });

  // User stop typing
  socket.on('stop_typing', (data) => {
    const { roomId } = data;
    socket.broadcast.to(roomId).emit('user_stop_typing', {
      userId: socket.userId
    });
  });

  // Leave room
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    io.to(roomId).emit('user_left', {
      userId: socket.userId,
      message: `User ${socket.userId} left the room`
    });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
};

module.exports = setupMessageHandlers;
