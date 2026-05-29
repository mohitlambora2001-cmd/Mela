const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a room name'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isPrivate: {
      type: Boolean,
      default: false
    },
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', RoomSchema);
