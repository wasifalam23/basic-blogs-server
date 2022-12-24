const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    trim: true,
    required: [true, 'Comment cannot be empty!'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment must belong to a user'],
  },

  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog',
    required: [true, 'Comment must belong to a blog'],
  },
});

commentSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: '-__v -email' }).populate({
    path: 'blog',
    select: 'author',
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
