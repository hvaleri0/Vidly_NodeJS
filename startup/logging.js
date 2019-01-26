const winston = require('winston')
require('winston-mongodb');
require('express-async-errors') //Use this instead of middleware async handler with try catch block

module.exports = function (){
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

    new winston.transports.Console ({
        colorized: true,
        prettyPrint: true
    }),

    new winston.transports.File ({
        filename: 'uncaughtExceptions.log'
    }) //
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
}