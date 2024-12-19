const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  snippetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Snippet', // Reference to the Snippet model
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // User who commented
    required: true,
  },
  text: {
    type: String,
    required: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Comment', CommentSchema);
