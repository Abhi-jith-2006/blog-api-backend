const router = require('express').Router();
const auth = require('../middlewares/auth.middleware');
const postController = require('../controllers/post.controller');
const optionalAuth = require('../middlewares/optionalauth.middleware');
const validate = require('../middlewares/validate.middleware');
const { getPostsValidator } = require('../validators/post.validator');
const { createPostValidator } = require('../validators/post.validator');
const { mongoIdParam } = require('../validators/param.validator');


//protected routes
router.post('/' , auth , createPostValidator , validate , postController.createPost);
router.patch('/:id' , auth ,  mongoIdParam('id') , validate , postController.updatePost);
router.delete('/:id' , auth , mongoIdParam('id') , validate, postController.deletePost);


//public routes
router.get('/' , optionalAuth , getPostsValidator , validate , postController.getAllPosts);
router.get('/:id' , optionalAuth , mongoIdParam('id') , validate , postController.getPostById);

module.exports = router;