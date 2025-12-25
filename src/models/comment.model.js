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
    }
},
  {timestamps : true}
)

module.exports = mongoose.model("Comment" , commentSchema)