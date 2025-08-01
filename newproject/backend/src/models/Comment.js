const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'O texto do comentário é obrigatório.'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Comment', CommentSchema);

