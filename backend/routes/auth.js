const express=require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router=express.Router();
const bcrypt= require('bcrypt');
var jwt=require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET='Shifaisagoodgi@#l'



//ROUTE 1: create a user using:Post "api/auth/createUser"  No login required(signup)
router.post('/createUser',[body('name','Enter a valid Name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 3 characters').isLength({min:3})
],
async (req, res) => {
    const errors = validationResult(req);
    // If there are errors, return bad request and the errors
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check whether a user with the same email already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "Sorry, a user with this email already exists" });
      }
      //Use bcrypt.js for password hashing
      const salt= await bcrypt.genSalt(10);
      const secPass= await bcrypt.hash(req.body.password,salt)

      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email
      });
      const data={
        id:user.id
      }
      const token=jwt.sign(data,JWT_SECRET);


      // Respond with the created user
      res.json(token);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);


//ROUTE 2: Authenticate a user using:Post "api/auth/createUser"
router.post('/loginUser',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password must be atleast 3 characters').isLength({min:3})
],
async (req, res) => {
  const errors = validationResult(req);
  // If there are errors, return bad request and the errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try{
    const{email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
      return res.status(400).json({error:"Please try to login with correct credentials"})
    }
    const passwordCompare=await bcrypt.compare(password,user.password);
    if(!passwordCompare){
      return res.status(400).json({error:"Please try to login with correct credentials"})
    }
    const data={
      id:user.id
    }
    const authtoken=jwt.sign(data,JWT_SECRET);
    // Respond with the created user
    res.json(authtoken);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})


//ROUTE 3: Get logedin user details using:Post "api/auth/getUser"  login required
router.post('/getUser',fetchUser,async (req,res)=>{
  try {
    uId=req.user.id;
    console.log(uId);
    const user=await User.findById(uId).select("-password");
    res.send(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})




module.exports = router;