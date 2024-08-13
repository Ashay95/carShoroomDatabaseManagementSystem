const express = require('express');
const app = express();
const ejs = require("ejs");
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static('public'));
const https = require('https');

app.set('view engine', 'ejs');


const { default: mongoose } = require('mongoose');
// var express = require("express"),
// mongoose = require("mongoose"),
passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose =
    require("passport-local-mongoose")
const User = require("./model/User");
const Car = require("./model/car");
const Cardetail = require("./model/cardetail");
const Admin = require("./model/admin");
const Query = require("./model/query");
const car = require('./model/car');



// var app = express();

// mongoose.connect("mongodb://localhost:27017/CarShowroomDB");
mongoose.connect("mongodb+srv://admin-rakesh:Rks887354@cluster0.c3rvdyz.mongodb.net/CarShowroomDB");



const NewCarDetail = mongoose.model("NewCarDetail", Cardetail.Cardetail);
const Src = mongoose.model("Src", Cardetail.Src);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get("/", function (req, res) {
//     res.render("home");
// });

// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});
function isAdmin(req, res, next) {
    // if (req.isAuthenticated() && (req.user.is_admin === 1)) {
    return next();
    // }
    // return res.redirect(403, "/error");
}

// Showing register form
app.get("/register", function (req, res) {
    res.render("register");
});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    else
        res.redirect("/login");
}
app.post("/register", async (req, res) => {
    User.findOne({ username: req.body.username }).then((result) => {
        if (result != null) {
            res.redirect("/login");
        }
        else {
            User.register({ username: req.body.username, name: req.body.name, role: "customer" }, req.body.password, (err, user) => {

                if (err) {
                    console.log(err);
                    res.redirect("/register");
                }
                else {
                    passport.authenticate("local")(req, res, () => {
                        const userName = req.user.name
                        res.redirect("/login");
                    });
                }

            });
        }
    })
});

app.get("/login", function (req, res) {
    if (req.isAuthenticated())
        res.render("index");
    else {
        res.render('login');
    }
});
app.post("/login", async function (req, res) {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(newUser, function (err) {
        if (err) {
            res.redirect("/login");
        }
        else {
            passport.authenticate("local")(req, res, () => {
                res.render("index");
            });

        }
    })
});

app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.get('/', function (req, res) {
    res.render("index");
});
app.get('/index', function (req, res) {
    res.render("index");
});
app.get('/services', function (req, res) {
    res.render("services");
});

app.get('/about', function (req, res) {
    res.render("about");
});
app.get('/contact', function (req, res) {
    res.render("contact")
});
app.get("/admin", (req, res) => {
    res.render("admin");
});
app.get("/booking", (req, res) => {

    Car.find({}).then((result) => {
        // console.log(result);
        if (result != null) {
            res.render("booking", { Allcar: result });
        }
        else {
            res.redirect("/booking");
        }
    })
});
function Booking(carType) {
    if (carType.avaibality > 0) {
        return true;
    }
}

app.post("/booking", (req, res) => {
    const CAR=req.body.model.split(',');
    if (req.isAuthenticated()) {
        // const userName=req.user;
        // console.log(CAR[0]);
        const UserName=req.user.username;

        Car.findOne({company: CAR[1] }).then((result) => {
            // console.log(result);
            if (result != null) {
                
                for (let i = 0; i < result.carType.length; i++) {
                    if (result.carType[i].carName == CAR[0]) {
                        if (result.carType[i].avaibality>0) {
                            result.carType[i].avaibality -= 1;
                            result.save();
                            console.log(UserName);
                            User.findOne({username:UserName}).then((result2)=>{
                                if(result2!=null)
                                {
                                    // console.log(result2);
                                    result2.cart.push(result.carType[i]);
                                    result2.save();
                                }
                                else{
                                    console.log("Error");
                                }
                            })
                            res.send('<script>alert("Booking Successful"); window.location.href = "/"; </script>');
                        }
                        else{
                            res.send('<script>alert("Currently Not Available"); window.location.href = "/booking"; </script>');
                        }

                    }
                }
            }
            else{
                res.redirect("/");
            }
        })
        // console.log(req.body.model);
    }
    else{
        res.redirect("/login");
    }
});





app.get("/admin/:listname", (req, res) => {
    // if(isAdmin(req,res)){
    const listName = req.params.listname;
    res.render(listName);
    // }
    // else
    // res.render("adminlogin");
});
app.post("/registercar", (req, res) => {
    // if(isAdmin(req,res)){
    let companyName = req.body.companyname;
    const src1 = new Src({
        src: req.body.images1
    });
    const src2 = new Src({
        src: req.body.images2
    });
    const src3 = new Src({
        src: req.body.images3
    });
    const src4 = new Src({
        src: req.body.images4
    });
    const imglist = [src1, src2, src3, src4];
    const newCarDetail = new NewCarDetail({
        carName: req.body.carname,
        route: companyName + req.body.carname,
        carHeading: req.body.heading,
        avaibality: req.body.availibility,
        milage: req.body.milage,
        fuelType: req.body.fuelType,
        serviceCost: req.body.serviceCost,
        tankCapacity: req.body.tankCapacity,
        engine: req.body.engine,
        BHP: req.body.BHP,
        cylinderCount: req.body.cylinderCount,
        gearCount: req.body.gearCount,
        tranmission: req.body.tranmission,
        rearAcVent: req.body.rearAcVent,
        seatingCapicity: req.body.seatingCapicity,
        bootSpace: req.body.bootSpace,
        Abs: req.body.abs,
        driverAirbag: req.body.driverAirbag,
        parkingSensor: req.body.parkingSensor,
        AirBag: req.body.airBag,
        discription: req.body.description,
        imgsrc: req.body.imgSrc,
        images: imglist,
        ref: companyName + "/" + companyName + req.body.carname
    });
    // console.log(req.body.carname);
    Car.findOne({ company: companyName }).then((result) => {
        if (result != null) {
            // console.log(newCarDetail);
            result.carType.push(newCarDetail);
            result.save();
            res.send('<script>alert("Succesfully Added"); window.location.href = "/admin/adminaddcar"; </script>');
        }
        else {
            res.redirect("/admin");
        }
    });
    // }
});
// app.get('/toyota',function(req,res){
//     res.render("toyota")
// });
// app.get('/audi',function(req,res){
//     res.render("audi")
// });
// app.get('/bmw',function(req,res){
//     res.render("bmw")
// });
// app.get('/chevrolet',function(req,res){
//     res.render("chevrolet")
// });
// app.get('/toyotaprado',function(req,res){
//     res.render("toyotaprado");

// });
// app.get('/toyotainnova',function(req,res){
//     res.render("toyotainnova")
// });
// app.get('/toyotaetios',function(req,res){
//     res.render("toyotaetios")
// });
// app.get('/toyotacamry',function(req,res){
//     res.render("toyotacamry")
// });
// app.get('/toyotafortuner',function(req,res){
//     res.render("toyotafortuner")
// });
// app.get('/audia8',function(req,res){
//     res.render("audia8")
// });
// app.get('/auditt',function(req,res){
//     res.render("auditt")
// });
// app.get('/audiQ7',function(req,res){
//     res.render("audiQ7")
// });
// app.get('/audiRS7',function(req,res){
//     res.render("audiRS7")
// });
// app.get('/audiR8',function(req,res){
//     res.render("audiR8")
// });
// app.get('/bmwi8',function(req,res){
//     res.render("bmwi8")
// });
// app.get('/bmwm3',function(req,res){
//     res.render("bmwm3")
// });
// app.get('/bmwm4',function(req,res){
//     res.render("bmwm4")
// });
// app.get('/bmwx3',function(req,res){
//     res.render("bmwx3")
// });
// app.get('/bmwx6',function(req,res){
//     res.render("bmwx6")
// });
// app.get('/chevroletEnjoy',function(req,res){
//     res.render("chevroletEnjoy")
// });
// app.get('/chevroletSail',function(req,res){
//     res.render("chevroletSail")
// });
// app.get('/chevroletTrailBlazer',function(req,res){
//     res.render("chevroletTrailBlazer")
// });
// app.get('/chevroletCruze',function(req,res){
//     res.render("chevroletCruze")
// });
// app.get('/chevroletBeat',function(req,res){
//     res.render("chevroletBeat")
// });

// app.get('/mitsubishi',function(req,res){
//     res.render("mitsubishi")
// });
// app.get('/mCedia',function(req,res){
//     res.render("mCedia")
// });
// app.get('/mLancer',function(req,res){
//     res.render("mLancer")
// });
// app.get('/montero',function(req,res){
//     res.render("montero")
// });
// app.get('/mOutlander',function(req,res){
//     res.render("mOutlander")
// });
// app.get('/mPajero',function(req,res){
//     res.render("mPajero")
// });

// app.get('/AstonMartin',function(req,res){
//     res.render("AstonMartin")
// });

// app.get('/amDB11',function(req,res){
//     res.render("amDB11")
// });
// app.get('/amRapide',function(req,res){
//     res.render("amRapide")
// });
// app.get('/amVanquish',function(req,res){
//     res.render("amVanquish")
// });
// app.get('/amVantage',function(req,res){
//     res.render("amVantage")
// });
// app.get('/amVulcan',function(req,res){
//     res.render("amVulcan")
// });

app.get("/:companyName", (req, res) => {
    companyName = req.params.companyName;
    if (companyName != "favicon.ico")
        Car.findOne({ company: companyName }).then((rslt) => {
            if (rslt != null) {
                let N = (rslt.carType).length;
                res.render("company", { result: (rslt.carType), n: N, companyName: companyName });
            }
            else {
                res.redirect("/");
            }
        });
});
app.get("/:companyName/:route", (req, res) => {
    const carname = req.params.route;
    const companyName = req.params.companyName;
    // console.log(carname +" "+companyName);
    Car.findOne({ company: companyName }).then(function (result) {
        // console.log(result);
        if (result != null) {
            const carType = result.carType;
            let flag = true;
            for (let i = 0; i < carType.length; ++i) {
                if (carType[i].route == carname) {
                    flag = false;
                    // console.log(carType[i].images);
                    res.render("cardetail", { data: carType[i] });
                    break;
                }
            }
            if (flag)
                res.redirect("/companyName");

        }
        else {
            res.send('<script>alert("Not available"); window.location.href = "/"; </script>');
        }
    });
});






app.listen(3000, function () {
    console.log('Server started at 3000');
});