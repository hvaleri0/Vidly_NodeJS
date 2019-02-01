const asyncMiddleware = require('../middleware/async')
const validateObjectId = require('../middleware/validateObjectId')
const auth = require ('../middleware/auth')
const admin = require ('../middleware/admin')
const {Genre,validateGenre} = require('../models/genre')
const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();

// const genres =[
//     {id:1, name: 'Action'},
//     {id:2, name: 'Adventure'},
//     {id:3, name: 'Comedy'},
//     {id:4, name: 'Crime'},
//     {id:5, name: 'Drama'},
//     {id:6, name: 'Fantasy'},
//     {id:7, name: 'Horror'},
//     {id:8, name: 'Mystery'},
//     {id:9, name: 'Romance'},
//     {id:10, name: 'Thriller'},
//     {id:11, name: 'Western'},
// ]

// router.get('/', (req,res) =>{
//     res.send(genres);
// });

// get Request with MongoDB
router.get('/', asyncMiddleware (async (req,res, next) => {
    //throw new Error('Could not get the genres.'); // fake an error for testing
    const genres = await Genre.find().sort('name');
    res.send(genres);
}));

//get ID Request 
// router.get('/:id', (req, res) =>{
//     const genre = genres.find(c => c.id===parseInt(req.params.id));
//     if (!genre) return res.status(404).send('The genre with the given ID was not found') ; //404 Object not found
//     res.send(genre);
// });

//get ID Request with MongoDB
router.get('/:id', validateObjectId, asyncMiddleware (async (req, res) =>{
    
    const genre = await Genre.findById(req.params.id)
    
    if (!genre) return res.status(404).send('The genre with the given ID was not found') ; //404 Object not found
    
    res.send(genre);
}));

//Post Request
// router.post('/', (req,res) =>{

//     const {error} = validateGenre(req.body);
//     if(error) return res.status(400).send(error.details[0].message);

//     const genre = {
//         id: genres.length+1,
//         name: req.body.name
//     };

//     genres.push(genre);
//     res.send(genre);
// });

//Post Request with MongoDB
router.post('/', auth, asyncMiddleware (async (req,res) => {
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = new Genre ({ name: req.body.name });
    await genre.save();

    res.send(genre);
}));

//Put Request
// router.put('/:id', (req,res) => {

//     const genre = genres.find(c => c.id===parseInt(req.params.id));
//     if (!genre) return res.status(404).send('The genre with the given ID was not found');  //404 Object not found

//     const {error} = validateGenre(req.body);
//     if(error) return res.status(400).send(error.details[0].message);

//     genre.name = req.body.name;
//     res.send(genre);

// });

//Put Request with MongoDB
router.put('/:id', auth, asyncMiddleware (async (req,res) => {

    const {error} = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {
        new:true
    });

    if (!genre) return res.status(404).send('The genre with the given ID was not found');  //404 Object not found

    res.send(genre);
}));

//Delete Request
// router.delete('/:id', (req,res) => {

//     const genre = genres.find(c => c.id===parseInt(req.params.id));
//     if (!genre) return res.status(404).send('The genre with the given ID was not found');  //404 Object not found

//     const index = genres.indexOf(genre);
//     genres.splice(index,1);

//     res.send(genre);
// });

//Delete Request with MongoDB
router.delete('/:id', [auth, admin], asyncMiddleware (async (req,res) => {

    const genre = await Genre.findByIdAndRemove(req.params.id);

    if (!genre) return res.status(404).send('The genre with the given ID was not found');  //404 Object not found

    res.send(genre);
}));

module.exports = router