const auth = require ('../middleware/auth')
const bcrypt   = require('bcrypt');
const _ = require ('lodash');
const {User,validateUser,validatepassword} = require('../models/user');
// const {Customer} = require('../models/customer');
const express = require('express');
const router = express.Router();

//Get Request 
router.get('/me', auth, async (req,res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user);
})

//Post Request with MongoDB
router.post('/', async (req,res) =>{
    const {error} = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message);

    const pwd = validatepassword(req.body.password);
    if(pwd.error) return res.status(400).send(pwd.error.details[0].message);

    // const customer = await Customer.findById(req.body.customerId);
    // if (!customer) return res.status(400).send('Invalid customer.');
    
    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('User already registered');

    // user = new User ({
    //     customer: {
    //         _id: customer._id, 
    //         name: customer.name
    //     },
    //     email: req.body.email,
    //     password: req.body.password
    // });

    user = new User (_.pick(req.body, ['name', 'email','password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send( _.pick(user, ['_id','name', 'email'])); //Lodash
});

module.exports = router;