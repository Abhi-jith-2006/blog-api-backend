const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');



exports.register = async (req , res) => {
  try{
    const { name , email , password} = req.body;

    if(!name || !email || !password){
      return res.status(400).json({success: false , message: "all fields are required"});
    }
    const exists = await User.findOne({email});
    if(exists){
      return res.status(400).json({success: false , message: "email already in use"});
    }
    const passwordHash = await bcrypt.hash(password , 10);
    const user = await User.create({
      name,
      email,
      passwordHash
    })

    return res.status(201).json({success: true , data: {
      id: user._id , name: user.name , email: user.email
    }})
  }
  catch(err){
    console.error(err);
    return res.status(500).json({success: false , message: "register error"})
  }
}




exports.login = async (req , res) => {
  try{

    const {email , password } = req.body;

    if(!email || !password){
      return res.status(400).json({
        success: false , message: "email and paassword are required"
      })
    }

    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({
        success: false , message: "no user on this email"
      })
    }
    
    const ok = await bcrypt.compare(password , user.passwordHash);
    if(!ok){
      return res.status(401).json({success: false , message: "invalid credentials"})
    }

    const token = jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET,
      {expiresIn: "1d"}
    )

    return res.status(200).json({success: true , data:{ token: token}})
  }
  catch(err){
    console.error(err);
    return res.status(500).json({success: false , message: "error in login"})
  }
}
