//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy; // Add this line it is important to define localstrategy
const passportLocalMongoose = require("passport-local-mongoose");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var findOrCreate = require("mongoose-findorcreate");
const port = 3000;
const app = express();

app.use(express.static("Public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'blahblah',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId:String,
  secret:String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


//for local and any kind of authentication 
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, {
      id: user.id,
      username: user.username,
      picture: user.picture
    });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    // userProfileURL:"https://googleapis.com/oauth2/v3/userinfo"
  },
  //call back function
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", (req, res) => {
  res.render("home");
});
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));
 
//request made by google server to authenticate the user credentials
app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/secrets",(req,res)=>{
  User.find({"secrets" :{$ne:null}})
    .then(foundUsers => {
      res.render("secrets", { usersWithSecrets: foundUsers });
    })
    .catch(err => {
      console.log(err);
    });
});
app.get("/submit",(req,res)=>{
  if(req.isAuthenticated()){
    res.render("submit");
  } else{
    res.redirect("/login");
  }
});
app.post("/submit",(req,res)=>{
  const submittedSecret = req.body.secret;
  User.findById(req.user.id)
    .then(foundUser => {
      if(foundUser){
        foundUser.secret = submittedSecret;
        foundUser.save()
          .then(() => {
            res.redirect("/secrets");
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
});


app.get("/logout",(req,res,next)=>{
  req.logout(function(err){
    if(err){
      return next(err);
    }
     res.redirect("/");
  });
 
});

app.post("/register", (req, res) => {
  User.register({ username: req.body.username }, req.body.password)
    .then(user => {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secrets");
      });
    })
    .catch(err => {
      console.log(err);
      res.redirect("/register");
    });
});
  // bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
  //   const newUser = new User({
  //     email: req.body.username,
  //     password: hash
  //   });

  //   newUser.save()
  //     .then(() => {
  //       res.render("secrets");
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.redirect("/register"); // Redirect to registration page on error
  //     });
  // });


app.post("/login", (req, res) => {
  const user=new User({
  username:req.body.username,
   password:req.body.password
  })
   req.login(user,function(err){
    if(err){
      console.log(err);
    } else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets");
      })
    }
   })
  

  // const username = req.body.username;
  // const password = req.body.password;

  // User.findOne({ email: username })
  //   .then((foundUser) => {
  //     if (foundUser) {
  //       bcrypt.compare(password, foundUser.password, function (err, result) {
  //         if (result === true) {
  //           res.render("secrets");
  //         } else {
  //           res.redirect("/login"); // Redirect to login page if password doesn't match
  //         }
  //       });
  //     } else {
  //       res.redirect("/login"); // Redirect to login page if user not found
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.redirect("/login"); // Redirect to login page on error
  //   });
});

app.listen(port, () => {
  console.log("Server is started on port 3000");
});
