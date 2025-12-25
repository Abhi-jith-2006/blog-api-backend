const Post = require('../models/post.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.createPost = catchAsync(async (req , res , next) => {
    
        const {title , content , status} = req.body;
        if(!title || !content){
            return next(new AppError('both fields required' , 400))
        }
        
        const post = await Post.create({
            title,
            content,
            author: req.user.id,
            status: status || 'draft'
        });
        return res.status(201).json({success: true , data: post});

})

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status, author, search } = req.query;

  const query = {};

 
  if (!req.user) {
    query.status = 'published';
  } else {
    query.$or = [
      { status: 'published' },
      { author: req.user.id }
    ];
  }

 
  if (status) {
    if (status === 'draft') {
      if (!req.user) {
        return res.status(200).json({
          success: true,
          data: [],
          meta: { total: 0, page: Number(page), limit: Number(limit), pages: 0 }
        });
      }
      query.status = 'draft';
      query.author = req.user.id;
      delete query.$or;
    } else {
      query.status = status;
    }
  }

  
  if (author) {
    query.author = author;
  }

  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];
  }

  const posts = await Post.find(query)
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Post.countDocuments(query);

  res.status(200).json({
    success: true,
    data: posts,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  });
});


exports.getPostById = catchAsync(async (req , res, next) => {
    
        const {id} = req.params;
        const post = await Post.findById(id);
        if(!post){
            return next(new AppError('post not found' , 404))
        }
        if (post.status === "draft" && post.author.toString() !== req.user?.id) {
            return next(new AppError('post not found' , 404))
        }       

        if (post.status === "archived") {
            return next(new AppError('post not found' , 404))
        }

        return res.status(200).json({success: true , data: post});
})

exports.updatePost = catchAsync(async (req , res , next) => {
    
        const id = req.params.id;
        const {title , content } = req.body;  
        
        const post = await Post.findById(id);
        if(!post){
            return next(new AppError ('post not found' , 404))
        }
        if(post.author.toString() !== req.user.id ){
            return next(new AppError ('post not found' , 404))
        }
        
        if(title){
            post.title = title
        }
        if(content){
            post.content = content
        }
        await post.save();

        return res.status(200).json({success: true , data: post})
        
})

exports.deletePost = catchAsync(async (req , res , next) => {

        const id = req.params.id;
        const post = await Post.findById(id);

        if(!post){
            return next(new AppError('post not found' , 404))
        }
        if(post.author.toString() !== req.user.id){
            return next(new AppError('post not found' , 404))
        }

        await post.deleteOne();
        return res.status(200).json({success: true , message: "post deleted"})

})

