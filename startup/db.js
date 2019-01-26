const winston = require ('winston');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true })
    .then(() => winston.info(`Connected to ${db}...`));
    //.catch(err => console.error('Could not connect to MongoDB...')); Let our global variable handle ths error
}