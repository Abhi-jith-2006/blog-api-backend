const router = require('express').Router();
const commentController = require('../controllers/comment.controller');
const auth = require('../middlewares/auth.middleware');
const optionalAuth = require('../middlewares/optionalauth.middleware');
const { createCommentValidator } = require('../validators/comment.validator');
const validate = require('../middlewares/validate.middleware');
const { mongoIdParam } = require('../validators/param.validator');



router.get('/posts/:postId/comments' , optionalAuth , mongoIdParam('postId') , validate , commentController.getCommentsForPost);
router.post('/posts/:postId/comments' , auth  , mongoIdParam('postId') ,createCommentValidator , validate , commentController.createComment);
router.delete('/comments/:id' , auth , mongoIdParam('id') , validate , commentController.deleteComment);

module.exports = router;