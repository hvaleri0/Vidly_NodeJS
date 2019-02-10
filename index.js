const winston = require('winston')
const express = require('express');
const app = express();

app.use(express.json());

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);


//throw new Error('Something failed during startup.') // Synchronous exception

// const p = Promise.reject( new Error('Something failed misserably!')); Promise rejection
// p.then(() => console.log('Done'));

//Get Request
app.get('/', (req, res)=>{
    res.send('Welcome to Vidly!');
});

//listen to port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;