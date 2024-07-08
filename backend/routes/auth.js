const express=require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const router=express.Router()
const bcrypt= require('bcrypt')



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

      // Respond with the created user
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;