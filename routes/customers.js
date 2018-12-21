const auth = require ('../middleware/auth')
const {Customer,validateCustomer} = require('../models/customer');
const express = require('express');
const router = express.Router();

// get Request with MongoDB
router.get('/', async (req,res) =>{
    const customer = await Customer.find().sort('name');
    res.send(customer);
});

//get ID Request with MongoDB
router.get('/:id', async (req, res) =>{
    const customer = customer.findById(req.params.id)
    if (!customer) return res.status(404).send('The customer with the given ID was not found') ; //404 Object not found
    res.send(customer);
});

//Post Request with MongoDB
router.post('/', auth, async (req,res) =>{
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = new Customer ({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });
    await customer.save();

    res.send(customer);
});

//Put Request with MongoDB
router.put('/:id', auth, async (req,res) => {
    const {error} = validateCustomer(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        }, {new:true});

    if (!customer) return res.status(404).send('The customer with the given ID was not found');  //404 Object not found

    res.send(customer);
});

//Delete Request with MongoDB
router.delete('/:id', auth, async (req,res) => {

    const customer = await Customer.findByIdAndRemove(req.params.id,)

    if (!customer) return res.status(404).send('The customer with the given ID was not found');  //404 Object not found

    res.send(customer);
});

module.exports = router;