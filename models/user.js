const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Joi = require ('joi');
const PasswordComplexity = require('joi-password-complexity');

const complexityOptions = {
    min: 5,
    max: 1024,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 3,
  }

const userSchema = new mongoose.Schema({
    // customer: {
        // type: new mongoose.Schema({
        //     name: {
        //         type: String,
        //         required: true,
        //         minlength: 5,
        //         maxlength: 50
        //     }
        // }),
        // required: true
        // },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _Id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
};

const User = mongoose.model('User', userSchema);

//Joi validation 
function validateUser(User){
    const schema ={
        // customerId: Joi.objectId().required(),
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    };    

    return Joi.validate(User, schema);
};

function validatePassword(password){
    return Joi.validate(password, new PasswordComplexity(complexityOptions));
};

exports.userSchema = userSchema;
exports.User = User;
exports.validateUser = validateUser;
exports.validatepassword = validatePassword;