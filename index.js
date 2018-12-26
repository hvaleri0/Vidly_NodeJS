//require('express-async-errors') //Use this instead of middleware async handler with try catch block
const winston = require('winston')
require('winston-mongodb');

const config = require('config');


const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/db')();

// process.on('uncaughtException', (ex) => {
//     //console.log('WE GOT AN UNCAUGHT EXCEPTION');
//     winston.error(ex.message,ex);
//     process.exit(1); //best practice is to terminate and restart the program 
// })

// process.on('unhandledRejection', (ex) => {
//     //console.log('WE GOT AN UNHANDLED REJECTION');
//     winston.error(ex.message,ex);
//     process.exit(1); //best practice is to terminate and restart the program 
// })

//Another way of catching exception and rejections is by using winstons built in library:
winston.handleExceptions(
    new winston.transports.File ({
        filename: 'uncaughtExceptions.log'
    })
)

process.on('unhandledRejection', (ex) => {
    throw ex; //no winston.unhandleRejection library but we can cheat by using the uncaught exception library
})

winston.add(winston.transports.File, {
    filename: 'logfile.log'
});

winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost/vidly',
    level: 'error' // only errror messages will be logged in database, if you set to  info - > errors, warnings and info will be logged
});

//throw new Error('Something failed during startup.') // Synchronous exception

// const p = Promise.reject( new Error('Something failed misserably!')); Promise rejection
// p.then(() => console.log('Done'));

if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

app.use(express.json());

//Get Request
app.get('/', (req, res)=>{
    res.send('Welcome to Vidly!');
});

//listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));