const mongoose = require('mongoose');
const cardetail = require('./cardetail');
const Schema = mongoose.Schema
// const passportLocalMongoose = require('passport-local-mongoose');
const Car = new Schema({
    company: {
        type: String
    },
    carType:[cardetail.Cardetail]
})

  
module.exports = mongoose.model('Car', Car);