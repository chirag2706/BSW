var docx = require("docx");
var fs = require('fs');
var request = require('request');
var express = require("express");
var router = express.Router();
var User = require("../views/models/users");
var passport = require("passport");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var isloggedIn = require("../views/middleware/auth");
var nodemailer = require("nodemailer");
var smtp = require("nodemailer-smtp-transport");
var xoauth2 = require("xoauth2");
var mailerhbs = require("nodemailer-express-handlebars");
var bcryptNodejs = require("bcrypt-nodejs");
var randomstring = require('randomstring');
var arr = [],number = 0;
var x,y,z,current;
var months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sep','Oct','Nov','Dec'];
// var flash = require("connect-flash");
// mongoose.connect("mongodb://localhost:27017/BSW|IITTP",{useNewUrlParser:true});

router.use(bodyParser.urlencoded({extended:true}));

const download = (uri, filename, callback) => {
    request.head(uri, (err, res, body) => {
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
// opening of Home page
router.get("/",function(req,res){
     req.flash("loading","Loading...");
     res.render("main",{currentUser:undefined});
});
//success of reseting of password of user
router.get("/resetPassword/:currentEmail",function(req,res){
    current = req.params.currentEmail;
    res.render("resetPassword",{currentEmail:current});
});


//routes of sending of emails
router.get('/forgotPassword',function(req,res){
    console.log("Step-1");
    res.render("forgotPassword",{currentUser:undefined});
});



router.post('/forgotPassword',function(req,res){
    x = req.body.email;
    console.log(x);
    var w = false;
    User.find({},(err,allUsers)=>{
        if (err){
            console.log(err);
            req.flash("error","Something went wrong");
            res.redirect("back");
        }else{
            for(var i=0;i<allUsers.length;i++){
                if (allUsers[i].Email == x){
                    w = true;
                    break;
                }
            }
            if (w == true){
                var transporter = nodemailer.createTransport(smtp({
                  service: 'gmail',
                  host:'smtp.gmail.com',
                  auth: {
                    xoauth2:xoauth2.createXOAuth2Generator({
                    	user:"cs18b006@iittp.ac.in",
                    	clientId:"141530558274-mcm7tdqrfl0rmu1cecghbsrr3ar1arcb.apps.googleusercontent.com",
                    	clientSecret:"jgmF6ayErR8DTu7RgATowpY6",
                    	refreshToken:"1/Sdz9xu3KWIV-4d67yTjNqCMtHJkblR4IwiPEbL40Yac"
                    })
                  }
                }));
                transporter.use("compile",mailerhbs({
                    viewEngine:{
                      extName:'.hbs',
                      partialsDir:"/home/chiggi/Desktop/BSW3/views/handler",
                      layoutsDir:"/home/chiggi/Desktop/BSW3/views/handler",
                      defaultLayout:"forgotPassword.hbs"
                    },
                    viewPath:"/home/chiggi/Desktop/BSW3/views/handler",
                    extName:'.hbs'
                }));
                // console.log(u);
                // if (u!==undefined){
                    var mailOptions = {
                      from: 'CS18B006 CHIRAG GUPTA <cs18b006@iittp.ac.in>',
                      to: x,
                      subject: 'Reset Password(BSW)',
                      template:"forgotPassword",
                      context:{
                          hostUrl:req.headers.host,
                          name:x
                      }
                    };
                    
                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error);
                        req.flash("error","Email-Id doesn't exists");
                        res.redirect("back");
                      } else {
                        console.log('Email sent');
                        req.flash("success","A link has been send to u at your provided email id");
                        res.redirect("/login");
                      }
                    });
            }else{
                req.flash("error","A user with this email-Id doesn't exists");
                res.redirect("back");
            }
        }
    });
    // console.log(req.headers);
            
        
});




//opening of forms(list)
router.get("/form/:id",(req,res)=>{
    User.findById(req.params.id,(err,currentUser)=>{
        if (err){
            res.redirect("back");
        }else{
            res.render("form",{currentUser});
        }
    })
    
});

router.post("/bonafideCertificate/:id",(req, res) => {
    // const documentCreator = new DocumentCreator();
    // const doc = documentCreator.create([experiences, education, skills, achievements]);
    
    const URL = 'https://pbs.twimg.com/profile_images/989383070041063424/owjnBhB8_400x400.jpg'
    download(URL,'heading.jpg',async ()=>{
        try{
        const date = new Date();
        console.log(date)
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const doc = new docx.Document();
        const image = doc.createImage(fs.readFileSync('heading.jpg'));
        const logo = new docx.Paragraph(image).center();
        const heading  = new docx.Paragraph('English Proficiency').heading1().center();
        const paragraph1 = new docx.Paragraph('To,');
        const paragraph2 = new docx.Paragraph('Academics');
        const paragraph3 = new docx.Paragraph("Indian Institute of Technology,");
        const paragraph5 = new docx.Paragraph(" ");
        const paragraph6 = new docx.Paragraph("Tirupati");
        const paragraph4 = new docx.Paragraph(`I, ${req.body.username},S/o Mr.${req.body.fathername} and Mrs. ${req.body.mothername} in the ${req.body.branch} Department (${req.body.batch}) requires to provide the bonafide certificate to ${req.body.place} for ${req.body.purpose}. My roll number is ${req.body.Roll}. I shall be very grateful to you for the early issue of the same.`);
        const paragraph7 = new docx.Paragraph("Subject -  regarding issuing of bonafide certificate")
        const paragraph8 = new docx.Paragraph("Dear Sir,");
        const paragraph9 = new docx.Paragraph("Sincerely,")
        const paragraph10 = new docx.Paragraph('<signature>');
        const paragraph11 = new docx.Paragraph(`${req.body.username}`);
        const paragraph12 = new docx.Paragraph(`${req.body.Roll}`);
        const paragraph13 = new docx.Paragraph(`${day}th ${months[month-1]},${year}`);
        console.log("hello");
        
        // doc.addImage(image);
        doc.addParagraph(heading);
        doc.addParagraph(paragraph1);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph2);
        doc.addParagraph(paragraph3);
        doc.addParagraph(paragraph6);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph13);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph7);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph8);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph4);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph9);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph10);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph11);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph12);
        const packer = new docx.Packer();
    
        const b64string = await packer.toBase64String(doc);
    
        res.setHeader("Content-Disposition", "attachment; filename=My Document.docx");
        res.send(Buffer.from(b64string, "base64"));
        }catch(err){
            console.log("Error is in downloading");
            console.log(err.message);
            req.flash("error",err.message);
            res.redirect("back");
        }
    });
    
});


//opening of bonafideCertificate form
router.get("/bonafideCertificate/:id",(req,res)=>{
    User.findById(req.params.id,(err,currentUser)=>{
        if (err){
            // req.flash("error","");
            res.redirect("back");
        }else{
            res.render("bonafideCertificate",{currentUser:currentUser});
        }
    });
});
router.get("/docx",(req, res) => {
    // const documentCreator = new DocumentCreator();
    // const doc = documentCreator.create([experiences, education, skills, achievements]);
    
    const URL = 'https://pbs.twimg.com/profile_images/989383070041063424/owjnBhB8_400x400.jpg'
    download(URL,'heading.jpg',async ()=>{
        try{
        const doc = new docx.Document();
        const image = doc.createImage(fs.readFileSync('heading.jpg'));
        const logo = new docx.Paragraph(image).center();
        const heading  = new docx.Paragraph('English Proficiency').heading1().center();
        const paragraph1 = new docx.Paragraph('To,');
        const paragraph2 = new docx.Paragraph('Academics');
        const paragraph3 = new docx.Paragraph("Indian Institute of Technology,");
        const paragraph5 = new docx.Paragraph(" ");
        const paragraph6 = new docx.Paragraph("Tirupati");
        const paragraph4 = new docx.Paragraph(`I, <legal name>,S/o Mr. <father name> and Mrs. <mother name> in the <Branch> Department (batch 20xx) requires a letter which states that mode of instruction in our institution is English, as a part of the paperwork for the internship at <place of internship> during this summer of 20xx. My roll number is <roll number>. I shall be very grateful to you for the early issue of the same.`);
        const paragraph7 = new docx.Paragraph("Subject -  regarding issuing of bonafide certificate")
        const paragraph8 = new docx.Paragraph("Dear Sir,");
        const paragraph9 = new docx.Paragraph("Sincerely,")
        const paragraph10 = new docx.Paragraph('<signature>');
        const paragraph11 = new docx.Paragraph('<legal name>');
        const paragraph12 = new docx.Paragraph('<roll number>');
        const paragraph13 = new docx.Paragraph(`<day>th<Month>,20xx`);
        console.log("hello");
        
        // doc.addImage(image);
        doc.addParagraph(heading);
        doc.addParagraph(paragraph1);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph2);
        doc.addParagraph(paragraph3);
        doc.addParagraph(paragraph6);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph13);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph7);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph8);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph4);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph9);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph10);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph11);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph12);
        const packer = new docx.Packer();
    
        const b64string = await packer.toBase64String(doc);
    
        res.setHeader("Content-Disposition", "attachment; filename=My Document.docx");
        res.send(Buffer.from(b64string, "base64"));
        }catch(err){
            console.log("Error is in downloading");
            console.log(err.message);
            req.flash("error",err.message);
            res.redirect("back");
        }
    });
    
});

//downloading of english proficiency template
router.get("/docx1",(req, res) => {
    // const documentCreator = new DocumentCreator();
    // const doc = documentCreator.create([experiences, education, skills, achievements]);
    
    const URL = 'https://pbs.twimg.com/profile_images/989383070041063424/owjnBhB8_400x400.jpg'
    download(URL,'heading.jpg',async ()=>{
        try{
        const doc = new docx.Document();
        const image = doc.createImage(fs.readFileSync('heading.jpg'));
        const logo = new docx.Paragraph(image).center();
        const heading  = new docx.Paragraph('English Proficiency').heading1().center();
        const paragraph1 = new docx.Paragraph('To,');
        const paragraph2 = new docx.Paragraph('Academics');
        const paragraph3 = new docx.Paragraph("Indian Institute of Technology,");
        const paragraph5 = new docx.Paragraph(" ");
        const paragraph6 = new docx.Paragraph("Tirupati");
        const paragraph4 = new docx.Paragraph(`I, <legal name>,S/o Mr. <father name> and Mrs. <mother name> in the <Branch> Department (batch 20xx) requires a letter which states that mode of instruction in our institution is English, as a part of the paperwork for the internship at <place of internship> during this summer of 20xx. My roll number is <roll number>. I shall be very grateful to you for the early issue of the same.`);
        const paragraph7 = new docx.Paragraph("Subject - Regarding English language proficiency")
        const paragraph8 = new docx.Paragraph("Dear Sir,");
        const paragraph9 = new docx.Paragraph("Sincerely,")
        const paragraph10 = new docx.Paragraph('<signature>');
        const paragraph11 = new docx.Paragraph('<legal name>');
        const paragraph12 = new docx.Paragraph('<roll number>');
        const paragraph13 = new docx.Paragraph(`<day>th<Month>,20xx`);
        console.log("hello");
        
        // doc.addImage(image);
        doc.addParagraph(heading);
        doc.addParagraph(paragraph1);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph2);
        doc.addParagraph(paragraph3);
        doc.addParagraph(paragraph6);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph13);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph7);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph8);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph4);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph9);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph10);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph11);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph12);
        const packer = new docx.Packer();
    
        const b64string = await packer.toBase64String(doc);
    
        res.setHeader("Content-Disposition", "attachment; filename=My Document.docx");
        res.send(Buffer.from(b64string, "base64"));
        }catch(err){
            console.log("Error is in downloading");
            console.log(err.message);
            req.flash("error",err.message);
            res.redirect("back");
        }
    });
    
});



//opening of EnglishProficiency form
router.get("/englishProficiency/:id",(req,res)=>{
    User.findById(req.params.id,(err,currentUser)=>{
        if (err){
            // req.flash("error","");
            res.redirect("back");
        }else{
            res.render("englishProficiency",{currentUser:currentUser});
        }
    });
});

router.post("/englishProficiency/:id",(req, res) => {
    // const documentCreator = new DocumentCreator();
    // const doc = documentCreator.create([experiences, education, skills, achievements]);
    
    const URL = 'https://pbs.twimg.com/profile_images/989383070041063424/owjnBhB8_400x400.jpg'
    download(URL,'heading.jpg',async ()=>{
        try{
        const date = new Date();
        console.log(date)
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const doc = new docx.Document();
        const image = doc.createImage(fs.readFileSync('heading.jpg'));
        const logo = new docx.Paragraph(image).center();
        const heading  = new docx.Paragraph('English Proficiency').heading1().center();
        const paragraph1 = new docx.Paragraph('To,');
        const paragraph2 = new docx.Paragraph('Academics');
        const paragraph3 = new docx.Paragraph("Indian Institute of Technology,");
        const paragraph5 = new docx.Paragraph(" ");
        const paragraph6 = new docx.Paragraph("Tirupati");
        const paragraph4 = new docx.Paragraph(`I, ${req.body.username},S/o Mr.${req.body.fathername} and Mrs. ${req.body.mothername} in the ${req.body.branch} Department (${req.body.batch}) requires to provide the bonafide certificate to <place where the application is to be submitted> for <why is it required>. My roll number is <roll number>. I shall be very grateful to you for the early issue of the same.
`);
        const paragraph7 = new docx.Paragraph("Subject - Regarding English language proficiency")
        const paragraph8 = new docx.Paragraph("Dear Sir,");
        const paragraph9 = new docx.Paragraph("Sincerely,")
        const paragraph10 = new docx.Paragraph('<signature>');
        const paragraph11 = new docx.Paragraph(`${req.body.username}`);
        const paragraph12 = new docx.Paragraph(`${req.body.Roll}`);
        const paragraph13 = new docx.Paragraph(`${day}th ${months[month-1]},${year}`);
        console.log("hello");
        
        // doc.addImage(image);
        doc.addParagraph(heading);
        doc.addParagraph(paragraph1);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph2);
        doc.addParagraph(paragraph3);
        doc.addParagraph(paragraph6);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph13);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph7);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph8);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph4);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph9);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph10);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph11);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph12);
        const packer = new docx.Packer();
    
        const b64string = await packer.toBase64String(doc);
    
        res.setHeader("Content-Disposition", "attachment; filename=My Document.docx");
        res.send(Buffer.from(b64string, "base64"));
        }catch(err){
            console.log("Error is in downloading");
            console.log(err.message);
            req.flash("error",err.message);
            res.redirect("back");
        }
    });
    
});

//downloading of NOC internsdhip funding form
router.get('/docx2',(req,res)=>{
    const URL = 'https://pbs.twimg.com/profile_images/989383070041063424/owjnBhB8_400x400.jpg'
    download(URL,'heading.jpg',async ()=>{
        try{
        const doc = new docx.Document();
        const image = doc.createImage(fs.readFileSync('heading.jpg'));
        const logo = new docx.Paragraph(image).center();
        const heading  = new docx.Paragraph('NOC for internship funding').heading1().center();
        const paragraph1 = new docx.Paragraph('To,');
        const paragraph2 = new docx.Paragraph('Academics');
        const paragraph3 = new docx.Paragraph("Indian Institute of Technology,");
        const paragraph5 = new docx.Paragraph(" ");
        const paragraph6 = new docx.Paragraph("Tirupati");
        const paragraph4 = new docx.Paragraph(`I, <legal name>,S/o Mr. <father name> and Mrs. <mother name> in the <Branch> Department (batch 20xx) requires to provide letter indicating that IIT Tirupati has no objection in case I receive funds (stipend) from my <research/industrial> internship program <Mention the company/college/institute>. The internship period is - xxth <Month> 20xx to xxth <Month> 20xx. My roll number is <roll number>. I shall be grateful to you for the early issue of the same.`);
        const paragraph7 = new docx.Paragraph("Subject - NOC/approval for receiving funds from the internship if provided");
        const paragraph8 = new docx.Paragraph("Dear Sir,");
        const paragraph9 = new docx.Paragraph("Sincerely,")
        const paragraph10 = new docx.Paragraph('<signature>');
        const paragraph11 = new docx.Paragraph('<legal name>');
        const paragraph12 = new docx.Paragraph('<roll number>');
        const paragraph13 = new docx.Paragraph(`<day>th<Month>,20xx`);
        console.log("hello");
        
        // doc.addImage(image);
        doc.addParagraph(heading);
        doc.addParagraph(paragraph1);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph2);
        doc.addParagraph(paragraph3);
        doc.addParagraph(paragraph6);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph13);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph7);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph8);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph4);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph9);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph10);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph11);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph12);
        const packer = new docx.Packer();
    
        const b64string = await packer.toBase64String(doc);
    
        res.setHeader("Content-Disposition", "attachment; filename=My Document.docx");
        res.send(Buffer.from(b64string, "base64"));
        }catch(err){
            console.log("Error is in downloading");
            console.log(err.message);
            req.flash("error",err.message);
            res.redirect("back");
        }
    });
})

//opening of NOC internship funding form
router.get("/NOCforInternshipFunding/:id",(req,res)=>{
    User.findById(req.params.id,(err,currentUser)=>{
        if (err){
            // req.flash("error","");
            res.redirect("back");
        }else{
            res.render("NOCforInternshipFunding",{currentUser:currentUser});
        }
    });
});

router.post('/NOCforInternshipFunding/:id',(req,res)=>{
    console.log(req.body);
    const URL = 'https://pbs.twimg.com/profile_images/989383070041063424/owjnBhB8_400x400.jpg'
    download(URL,'heading.jpg',async ()=>{
        try{
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate(); 
        const doc = new docx.Document();
        const image = doc.createImage(fs.readFileSync('heading.jpg'));
        const logo = new docx.Paragraph(image).center();
        const heading  = new docx.Paragraph('NOC for internship funding').heading1().center();
        const paragraph1 = new docx.Paragraph('To,');
        const paragraph2 = new docx.Paragraph('Academics');
        const paragraph3 = new docx.Paragraph("Indian Institute of Technology,");
        const paragraph5 = new docx.Paragraph(" ");
        const paragraph6 = new docx.Paragraph("Tirupati");
        const paragraph4 = new docx.Paragraph(`I, ${req.body.username},S/o Mr. ${req.body.fathername} and Mrs. ${req.body.mothername} in the ${req.body.branch} Department (${req.body.batch}) requires to provide letter indicating that IIT Tirupati has no objection in case I receive funds (stipend) from my ${req.body.type} internship program held by ${req.body.college}. The internship period is - ${req.body.duration} to ${req.body.end}. My roll number is ${req.body.Roll}. I shall be grateful to you for the early issue of the same.`);
        const paragraph7 = new docx.Paragraph("Subject - NOC/approval for receiving funds from the internship if provided");
        const paragraph8 = new docx.Paragraph("Dear Sir,");
        const paragraph9 = new docx.Paragraph("Sincerely,")
        const paragraph10 = new docx.Paragraph('<signature>');
        const paragraph11 = new docx.Paragraph(`${req.body.username}`);
        const paragraph12 = new docx.Paragraph(`${req.body.Roll}`);
        const paragraph13 = new docx.Paragraph(`${day}th${months[month-1]},${year}`);
        console.log("hello");
        
        // doc.addImage(image);
        doc.addParagraph(heading);
        doc.addParagraph(paragraph1);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph2);
        doc.addParagraph(paragraph3);
        doc.addParagraph(paragraph6);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph13);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph7);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph8);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph4);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph9);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph10);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph11);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph12);
        const packer = new docx.Packer();
    
        const b64string = await packer.toBase64String(doc);
    
        res.setHeader("Content-Disposition", "attachment; filename=My Document.docx");
        res.send(Buffer.from(b64string, "base64"));
        }catch(err){
            console.log("Error is in downloading");
            console.log(err.message);
            req.flash("error",err.message);
            res.redirect("back");
        }
    });
});


//downloading of transcript template
router.get("/docx3",(req, res) => {
    // const documentCreator = new DocumentCreator();
    // const doc = documentCreator.create([experiences, education, skills, achievements]);
    
    const URL = 'https://pbs.twimg.com/profile_images/989383070041063424/owjnBhB8_400x400.jpg'
    download(URL,'heading.jpg',async ()=>{
        try{
        const doc = new docx.Document();
        const image = doc.createImage(fs.readFileSync('heading.jpg'));
        const logo = new docx.Paragraph(image).center();
        const heading  = new docx.Paragraph('Transcript').heading1().center();
        const paragraph1 = new docx.Paragraph('To,');
        const paragraph2 = new docx.Paragraph('Academics');
        const paragraph3 = new docx.Paragraph("Indian Institute of Technology,");
        const paragraph5 = new docx.Paragraph(" ");
        const paragraph6 = new docx.Paragraph("Tirupati");
        const paragraph4 = new docx.Paragraph(`I, <Name>,S/o Mr. <father name> and Mrs. <mother name> in the <Branch> Department (batch 20xx)  require my transcript until <x> completed semesters for <mention why/where it is required>. My roll number is <Roll number> . I shall be very grateful to you for the early issue of the same.`);
        const paragraph7 = new docx.Paragraph("Subject - regarding issuing of transcripts till xth Sem")
        const paragraph8 = new docx.Paragraph("Dear Sir,");
        const paragraph9 = new docx.Paragraph("Sincerely,")
        const paragraph10 = new docx.Paragraph('<signature>');
        const paragraph11 = new docx.Paragraph('<legal name>');
        const paragraph12 = new docx.Paragraph('<roll number>');
        const paragraph13 = new docx.Paragraph(`<day>th<Month>,20xx`);
        console.log("hello");
        
        // doc.addImage(image);
        doc.addParagraph(heading);
        doc.addParagraph(paragraph1);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph2);
        doc.addParagraph(paragraph3);
        doc.addParagraph(paragraph6);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph13);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph7);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph8);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph4);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph9);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph10);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph11);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph12);
        const packer = new docx.Packer();
    
        const b64string = await packer.toBase64String(doc);
    
        res.setHeader("Content-Disposition", "attachment; filename=My Document.docx");
        res.send(Buffer.from(b64string, "base64"));
        }catch(err){
            console.log("Error is in downloading");
            console.log(err.message);
            req.flash("error",err.message);
            res.redirect("back");
        }
    });
    
});
//opening of Transcript form
router.get("/Transcript/:id",(req,res)=>{
    User.findById(req.params.id,(err,currentUser)=>{
        if (err){
            // req.flash("error","");
            res.redirect("back");
        }else{
            res.render("Transcript",{currentUser:currentUser});
        }
    });
});


router.post("/Transcript/:id",(req,res)=>{
    const URL = 'https://pbs.twimg.com/profile_images/989383070041063424/owjnBhB8_400x400.jpg'
    download(URL,'heading.jpg',async ()=>{
        try{
        var dat = new Date();
        console.log(`dat is ${dat}`);
        var year = dat.getFullYear();
        var month = dat.getMonth();
        var day = dat.getDate();
        const doc = new docx.Document();
        const image = doc.createImage(fs.readFileSync('heading.jpg'));
        const logo = new docx.Paragraph(image).center();
        const heading  = new docx.Paragraph('Transcript').heading1().center();
        const paragraph1 = new docx.Paragraph('To,');
        const paragraph2 = new docx.Paragraph('Academics');
        const paragraph3 = new docx.Paragraph("Indian Institute of Technology,");
        const paragraph5 = new docx.Paragraph(" ");
        const paragraph6 = new docx.Paragraph("Tirupati");
        const paragraph4 = new docx.Paragraph(`I, ${req.body.username},S/o Mr. ${req.body.fathername} and Mrs. ${req.body.mothername} in the ${req.body.branch} Department (${req.body.batch})  require my transcript until ${req.body.semester} completed semesters for ${req.body.purpose}. My roll number is ${req.body.Roll} . I shall be very grateful to you for the early issue of the same.`);
        const paragraph7 = new docx.Paragraph(`Subject - regarding issuing of transcripts till ${req.body.semester}th Sem`);
        const paragraph8 = new docx.Paragraph("Dear Sir,");
        const paragraph9 = new docx.Paragraph("Sincerely,")
        const paragraph10 = new docx.Paragraph('<signature>');
        const paragraph11 = new docx.Paragraph(`${req.body.username}`);
        const paragraph12 = new docx.Paragraph(`${req.body.Roll}`);
        const paragraph13 = new docx.Paragraph(`${day}th${months[month-1]},${year}`);
        console.log("hello");
        
        // doc.addImage(image);
        doc.addParagraph(heading);
        doc.addParagraph(paragraph1);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph2);
        doc.addParagraph(paragraph3);
        doc.addParagraph(paragraph6);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph13);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph7);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph8);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph4);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph9);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph10);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph11);
        doc.addParagraph(paragraph5);
        doc.addParagraph(paragraph12);
        const packer = new docx.Packer();
    
        const b64string = await packer.toBase64String(doc);
    
        res.setHeader("Content-Disposition", "attachment; filename=My Document.docx");
        res.send(Buffer.from(b64string, "base64"));
        }catch(err){
            console.log("Error is in downloading");
            console.log(err.message);
            req.flash("error",err.message);
            res.redirect("back");
        }
    });
})


//opening of mentorship page
router.get("/mentorship/:id",function(req,res){
    console.log(req.params);
    
    if (req.params.id === undefined || req.params.id === null){
        req.flash("error","First you need to login");
        res.redirect("/login");
    }else{
        // console.log("arr is");
        // console.log(arr);
        // console.log(number);
        // for(var i=0;i<number;i++){
        //     console.log(arr[i]._id);
        //     if (req.params.id == arr[i]._id){
        //         x = arr[i];
        //         break;
        //     }
        // }
        User.find({},(err,allUsers)=>{
            if (err){
                console.log(err);
            }else{
                for( var i=0;i<allUsers.length;i++){
                    if (req.params.id == allUsers[i]._id){
                        x = allUsers[i];
                        res.render("mentor",{currentUser:x});
                    }
                }
            }
        })
        // console.log(x);
        
        
    }
});
//opening of test page
router.get("/test/:id",function(req,res){
    if (req.params.id === undefined || req.params.id === null){
        req.flash("error","First you need to login");
        res.redirect("/login");
    }else{
        User.find({},(err,allUsers)=>{
            if (err){
                console.log(err);
            }else{
                for( var i=0;i<allUsers.length;i++){
                    if (req.params.id == allUsers[i]._id){
                        y = allUsers[i];
                        res.render("test",{currentUser:y});
                    }
                }
            }
        });
        
        
    }
});
//opening of questionPapers
router.get("/quest/:id",function(req,res){
    if (req.params.id === undefined || req.params.id === null){
        req.flash("error","First you need to login");
        res.redirect("/login");
    }else{
        User.find({},(err,allUsers)=>{
            if (err){
                console.log(err);
            }else{
                for( var i=0;i<allUsers.length;i++){
                    if (req.params.id == allUsers[i]._id){
                        z = allUsers[i];
                        res.render("quesPapers",{currentUser:z});
                    }
                }
            }
        })
        
    }
});

//checking of nss hours by currentUser

router.get('/checkHours/:id',(req,res)=>{
    User.findById(req.params.id,(err,currentUser)=>{
        if (err){
            res.redirect("back")
        }else{
            res.render("checkHours",{currentUser});
        }
    })
})

// updating of nss hours(only few people can access)
router.get("/updateHours/:id",(req,res)=>{
    console.log("first");
    if (req.params.id === undefined || req.params.id === null){
        req.flash("error","First you need to login");
        res.redirect("/login");
    }else{
        console.log("last");
        User.find({},(err,allUsers)=>{
            if (err){
                console.log(err);
            }else{
                for( var i=0;i<allUsers.length;i++){
                    if (req.params.id == allUsers[i]._id){
                        console.log("loop");
                        z = allUsers[i];
                        res.render("updateNssHours",{currentUser:z});
                    }
                }
            }
        });
        
    }
});

//logic of uploading of nssHours
router.post("/updateHours/:id",(req,res)=>{
    var f;
    User.find({},(err,allUsers)=>{
        if (err){
            console.log(err);
        }else{
            for( var i=0;i<allUsers.length;i++){
                if (allUsers[i]._id == req.params.id){
                    console.log("google");
                    f = allUsers[i];
                    res.render("updateNssHours",{nssCoordinator:req.body.spreadsheet,currentUser:f});
                }
            }
        }
    });
    
    
});
//creation of new account
router.get("/register",function(req,res){
    res.render("register",{currentUser:undefined});
});

//updating of existing account of a particular user

router.get("/account/:id",function(req,res){
    User.findById(req.params.id,function(err,currentuser){
        if (err){
            console.log(req.params.id);
            res.redirect("back");
            req.flash("error",err.message);
        }else{
            // if (v === true){
                console.log("currentuser is:");
                console.log(currentuser);
            //     v = false;
                res.render("account",{currentUser:currentuser});
        }
    });
});

//logic of updating
router.post("/account/:id",function(req,res){
    var newData = {
        username:req.body.username,
        Phone:req.body.phone,
        Email:req.body.email,
        Branch:req.body.branch,
        Batch:req.body.batch,
        Profession:req.body.profession
    }
    
    User.findByIdAndUpdate(req.params.id,{$set:newData},{
        upsert:false,
        new:false
        },function(err,currentUser){
        if (err){
            req.flash("error",err.message);
            res.redirect("back");
        }else{
            currentUser.username = req.body.username;
            // currentUser.Password=req.body.password;
            currentUser.Profession = req.body.profession;
            currentUser.Branch = req.body.branch;
            currentUser.Batch = req.body.batch;
            currentUser.Email = req.body.email;
            currentUser.Phone = req.body.phone;
            
            currentUser.save();
            for(var i=0;i<arr.length;i++){
                if (String(arr[i]._id) === String(currentUser._id)){
                    arr[i] = currentUser;
                    console.log(currentUser.username);
                    console.log(arr[i].username);
                    console.log("TRUE");
                    res.render("main",{currentUser});
                    break;
                }else{
                    console.log("FALSE");
                }
            }
            // console.log(typeof arr[0]._id);
            // console.log(typeof currentUser._id);
            // arr[0] = currentUser;
            // console.log(arr[0]);
            // console.log(currentUser);
            // // result = currentUser;
            // console.log(arr);
            // console.log("currentUser");
            // console.log(currentUser);
            // // result = currentUser;
            // res.render("main",{currentUser:currentUser});
            // // res.redirect("/");
        }
    });
});
//logic of registration
router.post("/register",function(req,res){
    var profession = req.body.profession,
        phone = req.body.phone,
        batch = req.body.batch,
        branch = req.body.branch,
        email = req.body.email,
        password = req.body.password,
        fullname = req.body.username,
        token = randomstring.generate();
    var userAccount = new User({
        username:fullname,
        Phone:phone,
        Email:email,
        Branch:branch,
        Batch:batch,
        Profession:profession,
        Password: password,
        token:token,
        active:false
        // g:0
    });
    var flag = true;
    var y = false;
    User.find({},function(err,allUsers){
        y = true;
        if (err){
            console.log(err);
            req.flash("error","Something went wrong");
            res.redirect("back");
        }else{
            for(var i=0;i<allUsers.length;i++){
                if (allUsers[i].Email == email){
                    flag = false;
                    break;
                }
            }
            console.log("hello");
            console.log(flag);
            if (flag === true || allUsers.length === 0){
                console.log("bee");
                bcryptNodejs.hash(req.body.password, null, null, (err, hash)=> {
                    if (err){
                        console.log(err);
                    }else{
                        hash = String(hash);
                        console.log(hash);
                        console.log("opps");
                        userAccount.Password = hash;
                        User.register(userAccount,req.body.password,(err,user)=>{
                            if (err){
                                console.log(err);
                                req.flash("error",err.message);
                                // user.g = 0;
                                res.redirect("back");
                            }else{
                                passport.authenticate("local")(req,res,function(){
                                    // user.g = 1
                                    console.log("auth");
                                    arr.push(user);
                                    number+=1;
                                    res.redirect("/"+user._id); 
                                    req.flash("success","An email has been sent for activiation purpose.");   
                                });
                        }
                    });
                    }
                    
                });
                
            }else{
                req.flash("error","A user with same email id already exists");
                res.redirect("back");
            }
        }
    });
    
});


//showing of login page
router.get("/login",function(req,res){
    res.render("login",{currentUser:undefined}); 
});


router.post("/login",function(req,res,next){
    var d;
    console.log(req.body);
    User.find({},function(err,allUsers){
        if (err){
            console.log(err);
        }else{
            var flag = false;
            for(var i=0;i<allUsers.length;i++){
                var u = bcryptNodejs.compareSync(req.body.password,allUsers[i].Password);
                if (allUsers[i].Email == req.body.email && u == true){
                    flag = true;
                    number+=1;
                    arr.push(allUsers[i]);
                    // allUsers[i].g = 1;
                    console.log("pass");
                    d = allUsers[i]._id;
                    req.flash("loading","Loading...");
                    res.redirect("/"+String(d));
                    // res.render("main",{currentUser:allUsers[i]});
                    // res.redirect("/"+String(allUsers[i]._id));
                    // break;
                }
            }if (flag === false){
                console.log("fail");
                
                req.flash("error","Invalid email or password");
                res.redirect("back");
            }
            
        }
    });
});
router.get("/:id",(req,res)=>{
    User.find({},(err,allUsers)=>{
            if (err){
                res.render("error");
            }else{
                for( var i=0;i<allUsers.length;i++){
                    if (req.params.id == allUsers[i]._id){
                        x = allUsers[i];
                        res.render("main",{currentUser:x});
                    }
                }
            }
        });
    
});



//logout logic
router.get("/logout/:id",function(req,res){
    var check = req.params.id;
    for (var i=0;i<number;i++){
        if (arr[i]._id == check){
            arr.splice(i,1);
            number-=1;
        }
    }
    req.logout();
    res.redirect("/");
});

router.post("/resetPassword/:userEmail",function(req,res){
    var mail = req.params.userEmail;
    console.log("mail is");
    console.log(mail);
    var newPassword = req.body.password;
    User.find({},function(err,allUsers){
        if (err){
            req.flash("error",err.message);
            res.redirect("back");

        }else{
            for(var i=0;i<allUsers.length;i++){
                if (allUsers[i].Email === mail){
                    console.log("yes");
                    allUsers[i].Password = newPassword;
                    allUsers[i].save();
                    req.flash("success","Password has been successfully updated");
                    res.redirect("/login");
                }
            }
        }
    });
});

module.exports = router;