const { body } = require('express-validator');

exports.registerValidator = [

    body('name').notEmpty()
                .withMessage('name is requird'),

    body('email').notEmpty()
    .isEmail().withMessage('email must be valid'),

    body('password').notEmpty().isLength({min: 6}).withMessage('password must be 6 or more charectors')
]

exports.loginValidator = [
    body('email').notEmpty()
    .isEmail().withMessage('email must be valid'),

    body('password').notEmpty().withMessage('password is required')
]