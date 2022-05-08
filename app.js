//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const TMDB_API_KEY_1 = "1cf50e6248dc270629e802686245c2c8"
const axios = require('axios')

const MovieDB = require('node-themoviedb');
const mdb = new MovieDB(TMDB_API_KEY_1);

const app = express();



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', (req, res)=>{

  (async () => {
      try {
        const movie = await mdb.movie.getPopular();
        
        const arrayOfPop = movie['data']['results']  
        const storeMovie = {}
        const arrayOfID = []
        arrayOfPop.forEach(element => {
            storeMovie[element.id] = "https://image.tmdb.org/t/p/original" + element.poster_path
          arrayOfID.push(element.id)
        });
      res.render('homepage', {storeMovie : storeMovie, arrayOfID : arrayOfID})
        console.log(storeMovie)
      } catch (error) {
        console.error(error);
      }
  })();

})

// app.get("/", function(req, res){
//       // res.render('homepage', {storeMovie : storeMovie, arrayOfID : arrayOfID})
//       res.render("homepage");
// });

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/popFilm");
  });

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("homepage", {usersWithSecrets: foundUsers});
      }
    }
  });
});

app.get("/submit", function(req, res){
  if (req.isAuthenticated()){
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", function(req, res){
  const submittedSecret = req.body.secret;

//Once the user is authenticated and their session gets saved, their user details are saved to req.user.
  // console.log(req.user.id);

  User.findById(req.user.id, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function(){
          res.redirect("/popFilm");
        });
      }
    }
  });
});

// app.get("/popFilm",function(req,res){
//   res.render("popFilm");
// })

app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/homepage");
      });
    }
  });

});

app.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/popFilm");
      });
    }
  });

});


app.get('/', (req, res)=>{
    res.send("hi")
})


app.get('/homepage', (req, res)=>{

    (async () => {
        try {
          const movie = await mdb.movie.getPopular();
          
          const arrayOfPop = movie['data']['results']  
          const storeMovie = {}
          const arrayOfID = []
          arrayOfPop.forEach(element => {
              storeMovie[element.id] = "https://image.tmdb.org/t/p/original" + element.poster_path
            arrayOfID.push(element.id)
          });
        res.render('homepage', {storeMovie : storeMovie, arrayOfID : arrayOfID})
          console.log(storeMovie)
        } catch (error) {
          console.error(error);
        }
    })();

})



const filmRoute = require('./routes/film')
const popFilmRoute = require('./routes/popFilm')

app.use('/film',filmRoute)
app.use('/popFilm',popFilmRoute)

app.get('/search', (req, res)=>{

  (async () => {
      try {
        const movie = await mdb.movie.getPopular();
        
        const arrayOfPop = movie['data']['results']  
        const storeMovie = {}
        const arrayOfID = []
        arrayOfPop.forEach(element => {
            storeMovie[element.id] = "https://image.tmdb.org/t/p/original" + element.poster_path
          arrayOfID.push(element.id)
        });
      res.render('searchResult', {storeMovie : storeMovie, arrayOfID : arrayOfID})
        console.log(storeMovie)
      } catch (error) {
        console.error(error);
      }
  })();

})

// app.listen(3000)



app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
