
// Admin.js
  
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var Admin = new mongoose.Schema({
    name:{
        type:String
    },
    username: {
        type: String
    },
    password: {
        type: String,
    }
})
  
Admin.plugin(passportLocalMongoose);
  
module.exports = mongoose.model('Admin', Admin);