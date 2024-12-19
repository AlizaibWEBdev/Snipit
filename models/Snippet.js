const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true, // e.g., 'JavaScript', 'Python', 'HTML'
  },
  description: {
    type: String,
    maxlength: 300,
  },
  tags: [
    {
      type: String, // e.g., ['JavaScript', 'React']
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Users who liked this snippet
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Snippet', SnippetSchema);
