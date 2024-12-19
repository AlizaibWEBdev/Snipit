const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  bio: {
    type: String, 
    default: 'I write Code that makes solutions',
  },
  profilePicture: {
    type: String, 
    default: 'default-profile-pic.jpg',
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  totalSnippetsCreated: {
    type: Number,
    default: 0,
  },
  totalLikes: {
    type: Number,
    default: 0,
  },
  interests: [
    {
      type: String, 
    },
  ],
  savedSnippets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Snippet', 
    },
  ],
  draft: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
