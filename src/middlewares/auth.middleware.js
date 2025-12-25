
const jwt = require('jsonwebtoken');

module.exports = function(req , res , next){
    
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({success: false , message: "no authorization header"})
    }

    const token = authHeader.split(' ')[1];
    if(!token) {
        return res.status(401).json({success: false , message: "no token "});
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = {id: decoded.id};
        next();
    }
    catch(err){
        console.error(err);
        return res.status(401).json({success: false , message: "error in auth middleware"})
    }
}