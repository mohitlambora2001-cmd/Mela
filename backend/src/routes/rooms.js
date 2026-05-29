const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create room
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, isPrivate } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Room name is required' });
    }
    
    const room = new Room({
      name,
      description,
      isPrivate,
      creator: req.userId,
      members: [req.userId]
    });
    
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all rooms
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find().populate('creator').populate('members');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get room by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('creator')
      .populate('members')
      .populate('messages');
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join room
router.post('/:id/join', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    if (!room.members.includes(req.userId)) {
      room.members.push(req.userId);
      await room.save();
    }
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leave room
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    room.members = room.members.filter(memberId => memberId.toString() !== req.userId);
    await room.save();
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
