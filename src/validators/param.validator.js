const { param } = require('express-validator');
const mongoose = require('mongoose');

exports.mongoIdParam = (name) => {
    return param(name).custom(value => mongoose.Types.ObjectId.isValid(value))
    .withMessage(name + ' should be a valid ObjectId');
}