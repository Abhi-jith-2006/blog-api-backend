const mongoose = require ('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    post: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Post'
    },
    author: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    idempotencyKey: {
        type: String,
        required: true,
    }
},
  {timestamps : true}
)

commentSchema.index(
  { author: 1, post: 1, idempotencyKey: 1 },
  { unique: true }
);


module.exports = mongoose.model("Comment" , commentSchema)