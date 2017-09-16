// ORDER OF CODE IS VERY IMPORTANT IN THIS FILE,
// DUE TO THE INCLUSION OF PASSPORT AUTH FUNCTIONALITY!

var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

mongoose.Promise = global.Promise;  // DISABLES THE CONSOLE ERROR

// 2. CONNECT TO (NEW OR EXISTING) DATABASE
mongoose.connect("mongodb://localhost/auth_demo_app", {useMongoClient: true});


var app = express();
app.set('view engine', 'ejs');

// Invoke body-parser to handle the user login form
app.use(bodyParser.urlencoded({extended:true}));

app.use(require("express-session")({
  secret: "Rusty is the best dog",
  resave: false,
  saveUninitialized: false
}));




//SETTING UP PASSPORT!!
app.use(passport.initialize());
app.use(passport.session());

//  IMPORTANT: Reponsible for encoding and unencoding data
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






//=================================
//    ROUTES
//=================================


// ROOT Route 
app.get('/', function(req, res){
  res.render('home');
});


//SECRET ROUTE
// Middleware function added to this route
app.get("/secret", isLoggedIn, function(req, res) {
  res.render("secret");
})


// AUTH Routes
// Show sign-up form
app.get("/register", function(req, res) {
  res.render("register");
});


// Handling user signup!!!
app.post("/register", function(req, res) {
  // These suffixes (username, password) are defined in the form
  // on 'register.ejs', inside the 'name' attribute.
  // req.body.username
  // req.body.password

  // Create a new user object, with only the username.
  // the "password" info is passed as a secnd argument
  User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    } else {
      // LOG THE USER IN!!
      passport.authenticate("local")(req, res, function() {
        res.redirect("/secret");
      });
    }
  });
});

// LOGIN ROUTES
// render login form

app.get("/login", function(req, res) {
 res.render("login");
});

//login logic
//this second route arg ('passp') is MIDDLEWARE:
// code that runs before the route callback! Sits between
// the start of the route and the handler at the end.
app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login'
}) , function(req, res) {
});



//LOGOUT
app.get('/logout', function(req, res) {
  // Tell Passport to destroy the user data in this session
  req.logout();
  res.redirect('/');
});



// THE MIDDLEWARE FUNCTION!! (standard structure below )
// Note: you don't need an 'else' after a 'return' (as seen below)
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}




app.listen(3000, function() {
  console.log("SERVER HAS BEGUUUN!");
});






