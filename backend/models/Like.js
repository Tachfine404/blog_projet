const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
}, {
  timestamps: true
});

// Un utilisateur ne peut liker qu'une seule fois un post
likeSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
