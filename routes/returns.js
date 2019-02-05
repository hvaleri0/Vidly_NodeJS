const express = require('express');
const {Rental} = require('../models/rental');
const router = express.Router();

router.post('/', async (req,res, next) => {
    let token = req.header('x-auth-token');
    let customerId = req.body.customerId;
    let movieId = req.body.movieId;

    if (!customerId) return res.status(400).send('customerId not provided');
    if (!movieId) return res.status(400).send('movieId not provided');

    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    });

    if(!rental) return res.status(404).send('Rental not found.')

    if(rental.dateReturned) return res.status(400).send('Return already processed')

    res.status(401).send('Unauthorized');
});

module.exports = router;