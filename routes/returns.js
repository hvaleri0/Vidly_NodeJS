const express = require('express');
const router = express.Router();

router.post('/', async (req,res, next) => {
    let token = req.header('x-auth-token');
    let customerId = req.body.customerId;
    let movieId = req.body.movieId;

    if (!token) return res.status(401).send('Unauthorized');
    if (!customerId) return res.status(400).send('customerId not provided');
    if (!movieId) return res.status(400).send('movieId not provided');
    
});

module.exports = router;