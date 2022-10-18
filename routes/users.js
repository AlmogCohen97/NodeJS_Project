const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { UserModel, validUser, createToken, validLogin } = require("../Model/userModel");
const { auth, authAdmin } = require("../middlewerare/auth");
const router = express.Router();


// Get UserData by Token
router.get("/myInfo",auth, async(req,res) => {
  try{
    let userInfo = await UserModel.findOne({_id:req.tokenData._id},{password:0});
    res.json(userInfo);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})
// Get all users by adminOnly !
router.get("/" ,authAdmin, async(req,res)=> {
    let perPage =  Math.min(req.query.perpage, 20) || 5 ;
    let page = req.query.page || 1 ;
    let sort = req.query.sort || "_id" ;
    let reverse = req.query.reverse == "yes" ? -1 : 1 ;
    let data = await UserModel.find({},{password:0})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({[sort]:reverse})
     res.json(data);
})

// Post of a new user
router.post("/", async (req, res) => {
  let validBody = validUser(req.body);
  if (validBody.error) {
      return res.status(400).json(validBody.error.details);
  }
  try {
      let user = new UserModel(req.body);
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
      user.password = "***";
      return res.status(201).json(user);
  }
  catch(err){
      console.log(err);
      res.status(500).json({msg:"err",err})
  }
})
// LOGIN START
router.post("/login", async(req,res) => {
  let validBody = validLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = await UserModel.findOne({email:req.body.email})
    if(!user){
      return res.status(401).json({msg:"Password or email is worng ,code:1"})
    }
    let authPassword = await bcrypt.compare(req.body.password,user.password);
    if(!authPassword){
      return res.status(401).json({msg:"Password or email is worng ,code:2"});
    }
    let mytoken = createToken(user._id,user.role);
    res.json({token:mytoken});
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})




module.exports = router;