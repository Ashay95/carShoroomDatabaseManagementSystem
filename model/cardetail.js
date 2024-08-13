
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const src=new mongoose.Schema({
    src:String
});
const Cardetail=new mongoose.Schema({
    carName:String,
    route:String,
    carHeading:String,
    avaibality:Number,
    milage:String,
    fuelType:String,
    serviceCost:String,
    tankCapacity:String,
    engine:String,
    BHP:String,
    cylinderCount:Number,
    gearCount:Number,
    tranmission:String,
    rearAcVent:String,
    seatingCapicity:Number,
    bootSpace:String,
    Abs:String,
    driverAirbag:String,
    parkingSensor:String,
    AirBag:String,
    discription:String,
    imgsrc:String,
    images:[src],
    ref:String
})

// module.exports.Cardetail =mongoose.Schema(Cardetail);
// module.exports.src=mongoose.Schema(src);
module.exports={
    Cardetail:mongoose.Schema(Cardetail),
    Src:mongoose.Schema(src)

}











