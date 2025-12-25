const {body} = require('express-validator');

exports.createCommentValidator = [
    body('content').trim().notEmpty().withMessage('content is required')
]