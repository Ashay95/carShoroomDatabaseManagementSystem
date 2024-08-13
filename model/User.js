
// User.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const cardetail = require('./cardetail');
const passportLocalMongoose = require('passport-local-mongoose');
var User = new mongoose.Schema({
    name:{
        type:String
    },
    username: {
        type: String
    },
    password: {
        type: String,
    },
    role:String,
    cart:[cardetail.Cardetail]
})
  
User.plugin(passportLocalMongoose);
  
module.exports = mongoose.model('User', User)