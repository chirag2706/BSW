function isloggedin(req,res,next){
    if (req.isAuthenticated()){
        console.log(req.isAuthenticated());
        next();
    }else{
        req.flash("error","First U need to login");
        res.redirect("/login");
    }
}


module.exports=isloggedin