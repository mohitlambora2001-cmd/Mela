const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Please provide message content'],
      trim: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    attachments: [{
      type: String,
      default: null
    }],
    isEdited: {
      type: Boolean,
      default: false
    },
    editedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', MessageSchema);
