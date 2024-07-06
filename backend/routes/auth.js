const express=require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router=express.Router()


router.post('/',[body('name','Enter a valid Name').isLength({min:3}),
    body('email','Enter a valid email').isEmail(),
    body('password','Password must be atleast 3 characters').isLength({min:3})
],
(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({erros:errors.array()});
    }
    User.create({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email
    }).then(user=>res.json(user))
    .catch(error=>{console.log(error)
        res.json({err:"Please Enter a unique value for Email",message:error.message})
    });
})

module.exports=router