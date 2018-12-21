const auth = require ('../middleware/auth')
const bcrypt = require('bcrypt');
const Joi = require ('joi');
const _ = require ('lodash');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

//Post Request with MongoDB
router.post('/', async (req,res) =>{
    const {error} = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message);
    
    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password,user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);

});

function validateUser(User){
    const schema ={
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    };    

    return Joi.validate(User, schema);
}

module.exports = router;