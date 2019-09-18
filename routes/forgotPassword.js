const smtp = require('nodemailer-smtp-transport');
const xoauth2 = require('xoauth2');
const nodemailer = require('nodemailer');
const mailerhbs = require('nodemailer-express-handlebars');
const User = require('../views/models/users');
const emailExistence = require('email-existence');
const RandomString = require('randomstring');
const bcrypt = require('bcrypt-nodejs');

exports.forgotPassword = async (req,res)=>{
  const emailId = req.body.emailId;
  const secretToken = RandomString.generate();
  const response = await User.findOne({emailId:emailId});
  if (response !== null){
    if (!response.active){
      return res.status(200).json({error:"First,verify your email-Id"});
    }
    try{
      response.token = secretToken;
      await response.save();
      // var x = TokenForUser(newUser);
      // req.headers.authorization = x
      // console.log('inside register the req.headers looks like');
      // console.log(req.headers);
      // res.status(200).json({token:x});
      const transporter = await nodemailer.createTransport(smtp({
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
      //   transporter.use("compile",mailerhbs({
      //       viewEngine:{
      //         extName:'.hbs',
      //         partialsDir:"/home/chiggi/Desktop/mindsprint-backend-version-2.0/misc",
      //         layoutsDir:"/home/chiggi/Desktop/mindsprint-backend-version-2.0/misc",
      //         defaultLayout:"emailVerification.hbs"
      //       },
      //       viewPath:"/home/chiggi/Desktop/mindsprint-backend-version-2.0/misc",
      //       extName:'.hbs'
      //   }));
        // console.log(u);
        // if (u!==undefined){
      const mailOptions = {
        from: 'CS18B006 CHIRAG GUPTA <cs18b006@iittp.ac.in>',
        to: emailId,
        subject: 'RESET PASSWORD',
        html: `<!doctype html>
        <html>
          <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}</style>
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
          </head>
          <body>
          <div>copy this <strong>${secretToken}</strong></div>
            <div>
                click  <a href = "http://localhost:3000/changePassword" onclick = "console.log('choga')">here</a> and change your password.
            </div>
            <div>If u have not done this action then feel free to avoid this mail.</div>
            <div>Have a nice day.</div>
            <div>Team <strong>MindSprint</strong></div>
            <script
            src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
            integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
            crossorigin="anonymous"
            ></script>
            <script
            src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
            integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
            crossorigin="anonymous"
            ></script>
            <script
            src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
            integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
            crossorigin="anonymous"
            ></script>
  
          </body>
        </html>`,
        context:{
            hostUrl:req.headers.host,
            name:emailId
        }
      };
      // transporter.verify()
      // emailExistence.check(emailId,async function(error,response){
      //   console.log('response inside email-existence is',response);
      //   try{
          // if (response){
            await transporter.sendMail(mailOptions, async function(error, info){
              try{
                console.log('Email sent');
                console.log(info);
                res.status(200).json({success:"Email has been sent successfully",token:secretToken,emailId:emailId});
              }catch(err){
                response.secretToken = "";
                await response.save();
                console.log(error);
                res.status(200).json({error:error.message});
              }
  
            });                    

  
      
    }catch(err){
      response.secretToken = "";
      await response.save();
      res.status(200).json({error:err.message});
    }  
  
  }else{
    
      res.status(200).json({error:"User with this email doesn't exists."});
  }
  
}


exports.emailVerification = async (req,res)=>{
    const emailId = req.body.emailId;
    const secretToken = RandomString.generate();
    const response = await User.findOne({emailId:emailId});
    if (response !== null){
      if (!response.active){
        return res.status(200).json({error:"First,verify your email-Id"});
      }
      try{
        response.token = secretToken;
        await response.save();
        // var x = TokenForUser(newUser);
        // req.headers.authorization = x
        // console.log('inside register the req.headers looks like');
        // console.log(req.headers);
        // res.status(200).json({token:x});
        const transporter = await nodemailer.createTransport(smtp({
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
        //   transporter.use("compile",mailerhbs({
        //       viewEngine:{
        //         extName:'.hbs',
        //         partialsDir:"/home/chiggi/Desktop/mindsprint-backend-version-2.0/misc",
        //         layoutsDir:"/home/chiggi/Desktop/mindsprint-backend-version-2.0/misc",
        //         defaultLayout:"emailVerification.hbs"
        //       },
        //       viewPath:"/home/chiggi/Desktop/mindsprint-backend-version-2.0/misc",
        //       extName:'.hbs'
        //   }));
          // console.log(u);
          // if (u!==undefined){
        const mailOptions = {
          from: 'CS18B006 CHIRAG GUPTA <cs18b006@iittp.ac.in>',
          to: emailId,
          subject: 'RESET PASSWORD',
          html: `<!doctype html>
          <html>
            <head>
              <meta charset="utf-8">
              <style amp4email-boilerplate>body{visibility:hidden}</style>
              <script async src="https://cdn.ampproject.org/v0.js"></script>
              <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
            </head>
            <body>
            <div>copy this <strong>${secretToken}</strong></div>
              <div>
                  click  <a href = "http://localhost:3000/changePassword" onclick = "console.log('choga')">here</a> and change your password.
              </div>
              <div>If u have not done this action then feel free to avoid this mail.</div>
              <div>Have a nice day.</div>
              <div>Team <strong>MindSprint</strong></div>
              <script
              src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
              integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
              crossorigin="anonymous"
              ></script>
              <script
              src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
              integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
              crossorigin="anonymous"
              ></script>
              <script
              src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
              integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
              crossorigin="anonymous"
              ></script>
    
            </body>
          </html>`,
          context:{
              hostUrl:req.headers.host,
              name:emailId
          }
        };
        // transporter.verify()
        // emailExistence.check(emailId,async function(error,response){
        //   console.log('response inside email-existence is',response);
        //   try{
            // if (response){
              await transporter.sendMail(mailOptions, async function(error, info){
                try{
                  console.log('Email sent');
                  console.log(info);
                  res.status(200).json({success:"Email has been sent successfully",token:secretToken,emailId:emailId});
                }catch(err){
                  response.secretToken = "";
                  await response.save();
                  console.log(error);
                  res.status(200).json({error:error.message});
                }
    
              });                    
  
    
        
      }catch(err){
        response.secretToken = "";
        await response.save();
        res.status(200).json({error:err.message});
      }  
    
    }else{
      
        res.status(200).json({error:"User with this email doesn't exists."});
    }
    
  }
  

exports.changePassword = async (req,res)=>{
  console.log('req.body inside changePassowrd',req.body);
  const user = await Student.findOne({emailId:req.body.emailId});
  const password = req.body.password;
  await bcrypt.genSalt(12,async function(err,salt){
    if (err){
      return res.status(200).json({error:"Something went wrong"});
    }
    await bcrypt.hash(password,salt,null,async function(err,hash){
      if (err){
        return res.status(200).json({error:"Something went wrong"});
      }
      user.password = hash;
      await user.save();
    });
  });
  res.status(200).json({success:"You have successfully changed your password"});


}