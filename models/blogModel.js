const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A blog must have a title'],
    },

    description: {
      type: String,
      required: [true, 'A blog must have some description'],
    },

    image: {
      type: String,
      required: [true, 'A blog must have an image'],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A blog must belong to an author'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.pre(/^find/, function (next) {
  this.populate({ path: 'author', select: '-__v' });

  next();
});

// virtual populate
blogSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'blog',
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
