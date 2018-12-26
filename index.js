const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express');
const app = express();


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();


//throw new Error('Something failed during startup.') // Synchronous exception

// const p = Promise.reject( new Error('Something failed misserably!')); Promise rejection
// p.then(() => console.log('Done'));

app.use(express.json());

//Get Request
app.get('/', (req, res)=>{
    res.send('Welcome to Vidly!');
});

//listen to port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));