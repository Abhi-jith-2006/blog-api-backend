const AppErrors = require('../utils/AppError');

module.exports = (err, req, res, next) => {

    let statusCode = err.statusCode || 500;
    let message = err.message || 'internal server error';

    if(err.isOperational){
        return res.status(statusCode).json({success: false , message})
    }
    if(err.name === 'JsonWebTokenError'){
        return res.status(401).json({success: false , message: 'invalid token. please try again'});
    }

    if(err.name === 'TokenExpiredError'){
        return res.status(401).json({success: false , message: 'token expired . please login again'})
    }

    if (err.name === 'CastError' ){
        return res.status(400).json({success: false , message: 'invalid resource id'})
    }
    if(err.code === 11000){
        const field = Object.keys(err.keyValue)[0];

        return res.status(409).json({success: false , message: field + ' already exists'});
    }

    console.error('error occured:  ',err);
    return res.status(500).json({success: false , message: 'internal server error'})

}