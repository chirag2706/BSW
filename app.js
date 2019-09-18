var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var passportLocalMongoose = require("passport-local-mongoose");
var passport = require("passport");
var passportLocal = require("passport-local").Strategy;
var session = require("express-session");
var cookieParser = require("cookie-parser");
var methodOverride = require("method-override");
var flash = require("connect-flash");
var isloggedIn = require("./views/middleware/auth");
var compression = require("compression");
var nodemailer = require("nodemailer");
var smtp = require("nodemailer-smtp-transport");
var cors = require("cors");
app.use(compression());
app.use(methodOverride("_method"));
var helmet = require("helmet");
app.use(helmet());
app.use(cors());
//setting of ejs extension
app.set("view engine","ejs");


//extracting body from req
app.use(bodyParser.urlencoded({extended:true}));


// using of public directory
app.use(express.static("public"));


// //connecting of database(local server)
// mongoose.connect("mongodb://localhost:27017/BSW|IITTP",{useNewUrlParser:true});


//using users model
mongoose.set("useCreateIndex",true);


var User = require("./views/models/users");
var mainRoutes = require("./routes/index");


//cookie-parser parses cookies and puts cookie information in req.body
app.use(cookieParser("secret"));
var expiryDate = new Date(Date.now()+100000);
//configuration of passport
app.use(session({
    secret: "chirag Gupta has developed this website",
    resave: false,
    saveUninitialized: false,
    expires:expiryDate
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//app will use this middleware every time whenever app will get refresh or start
app.use(function(req,res,next){
    // res.locals.name = req.user.username ;
    res.locals.successMessage = req.flash("success");
    res.locals.errorMessage = req.flash("error");
    res.locals.loadingMessage = req.flash("loading");
    console.log(res.locals);
    next();
});


//sending emails to those users who have forgot their password



//app accessing routes
app.use("/",mainRoutes);
app.use("/register",mainRoutes);
app.use("/mentorship",mainRoutes);
app.use("/test",mainRoutes);
app.use("/quest",mainRoutes);
app.use("/login",mainRoutes);
app.use("/logout",mainRoutes);

//app will listen (means app will start)
app.listen(3005,function(){
    console.log("server has started with 3005");
});