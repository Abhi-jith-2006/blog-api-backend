const {query , body} = require('express-validator');
const mongoose = require('mongoose');

exports.getPostsValidator = [
    query('page').optional()
                 .isInt({min: 1})
                 .withMessage('page should be a number greater than or equal to 1'),

    query('limit').optional()
                  .isInt({min: 1 , max: 50})
                  .withMessage('limit should be >= 1 and <= 50'),

    query('status').optional()
                   .isIn(['draft' , 'published'])
                   .withMessage('status need to be published or draft'),

    query('author').optional()
                   .custom(value => mongoose.Types.ObjectId.isValid(value))
                   .withMessage('author must be a valid ObjectId')
]

exports.createPostValidator = [

    body('title').trim().notEmpty().withMessage('title is required'),
    body('content').trim().notEmpty().withMessage('content is required'),
    body('status').optional().isIn(['draft' , 'published']).withMessage('status can either be draft or published')
    
]