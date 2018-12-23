//require('express-async-errors') //Use this instead of middleware async handler with try catch block
const winston = require('winston')
require('winston-mongodb');
const error = require('./middleware/error')
const config = require('config');

const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

const express = require('express');
const app = express();

process.on('uncaughtException', (ex) => {
    //console.log('WE GOT AN UNCAUGHT EXCEPTION');
    winston.error(ex.message,ex);
    process.exit(1); //best practice is to terminate and restart the program 
})

process.on('unhandledRejection', (ex) => {
    //console.log('WE GOT AN UNHANDLED REJECTION');
    winston.error(ex.message,ex);
    process.exit(1); //best practice is to terminate and restart the program 
})


//Another way of catching exception and rejections is by using winstons built in library:
// winston.handleExceptions(
//     new winston.transports.File ({
//         filename: 'uncaughtExceptions.log'
//     })
// )

// process.on('unhandledRejection', (ex) => {
//     throw ex; //no winston.unhandleRejection library but we can cheat by using the uncaught exception library
// })


winston.add(winston.transports.File, {
    filename: 'logfile.log'
});

winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost/vidly',
    level: 'error' // only errror messages will be logged in database, if you set to  info - > errors, warnings and info will be logged
});

//throw new Error('Something failed during startup.') // Synchronous exception
const p = Promise.reject( new Error('Something failed misserably!'));
p.then(() => console.log('Done'));

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

//Get Request
app.get('/', (req, res)=>{
    res.send('Welcome to Vidly!');
});

//listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));