const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getCommentsForPost = catchAsync(async (req , res , next) => {
    
        const {postId} = req.params;
        const post = await Post.findById(postId);
        
        if(!post) {
            return next(new AppError ('post not found' , 404));
        }
        if(post.status === 'draft' && post.author.toString() !== req.user?.id){
            return next(new AppError ('post not found' , 404));
        }

        const comments = await Comment.find({post : postId}).populate('author' , 'name').sort({createdAt : -1})

        return res.status(200).json({success: true , data: comments})
    
})

exports.createComment = catchAsync(async (req , res , next) => {
    
        const {postId} = req.params;
        const {content} = req.body ;
        const post = await Post.findById(postId);

        if(!post){
            return next(new AppError ('post not found ' , 404));
        }

        if(post.status === 'draft' && post.author.toString() !== req.user?.id){
            return next(new AppError('post not found' , 404))
        }

        const comment = await Comment.create({
            content,
            author: req.user.id,
            post: postId
        })
        return res.status(201).json({success: true , data: comment})

})


exports.deleteComment = catchAsync(async (req , res , next) => {

        const id = req.params.id;
        const comment = await Comment.findById(id);

        if (!comment){
            return next(new AppError('comment not found' , 404))
        }
        if(comment.author.toString() !== req.user.id){
            return next(new AppError('comment not found' , 404))
        }
        
        await Comment.findByIdAndDelete(id);
        return res.status(200).json({success: true , message: 'comment deleted'})

})

