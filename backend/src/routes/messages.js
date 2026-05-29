const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// Send message
router.post('/', auth, async (req, res) => {
  try {
    const { content, roomId } = req.body;
    
    if (!content || !roomId) {
      return res.status(400).json({ error: 'Content and roomId are required' });
    }
    
    const message = new Message({
      content,
      sender: req.userId,
      room: roomId
    });
    
    await message.save();
    
    // Add message to room
    await Room.findByIdAndUpdate(
      roomId,
      { $push: { messages: message._id } }
    );
    
    await message.populate('sender');
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for room
router.get('/room/:roomId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .populate('sender')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete message
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    if (message.sender.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
