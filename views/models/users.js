var mongoose = require("mongoose");
//connecting of mongoose on local server
mongoose.connect('mongodb://localhost:27017/localBWS',{useNewUrlParser:true});
var passportLocalMongoose = require("passport-local-mongoose"); 
//making of schema
var schema = new mongoose.Schema({
    username:String,
    Phone:Number,
    Profession:String,
    Batch:String,
    Branch:String,
    Email:String,
    Password:String,
    token:String,
    active:Boolean
});
//plugging of local-passport-mongoose features into user-schema
schema.plugin(passportLocalMongoose);
//model formation
var model = mongoose.model("User",schema);
module.exports = model;