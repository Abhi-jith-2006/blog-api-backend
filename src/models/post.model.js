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
    },
    idempotencyKey: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

postSchema.index(
  { idempotencyKey: 1 , author: 1},
  {unique: true}
)

module.exports = mongoose.model('Post', postSchema);
