const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['draft' , 'archieved' , 'published'],
      default: 'draft'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);
