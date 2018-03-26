var express = require('express');
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var User = require('./app/nightlife/models/users.js');
//'dotenv' is a module which loads environment variables 
//form a .env file into process.env
require('dotenv').load();

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
//console.log(process.env.MONGO_URI);

/*------------Passport configuration starts------------------*/
passport.use(new Strategy(
  function(username, password, cb) {
    User.findOne({'username': username}, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

/*------------Passport configuration ends------------------*/

/*------------app configuration starts---------------*/
var app = express();

// views is directory for all template files
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(process.cwd() + '/public'));

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
//app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

//configure passport.initialize() middleware
app.use(passport.initialize());
//use persistent login session
app.use(passport.session());

/*------------app configuration ends---------------*/

app.get('/', function(request, response) {
	response.render('home');
});

/*-----------Routes for Stock app starts----------------*/
app.get('/stock', function(request, response) {
	response.render('stock/index');
});

var StockHandler = require(path.join(__dirname+'/app/stock/controllers/stockHandler.js'));
var stockHandler = new StockHandler();
app.get('/stock/all', stockHandler.getStock);
app.get('/stock/delete', stockHandler.deleteStock);
app.post('/stock/add', stockHandler.addStock);
/*-----------Routes for Stock app ends----------------*/

/*-----------Routes for Nightlife app starts----------------*/
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    //console.log('yes');
    //next() calls the next callback function
    return next();
  } else {
    //console.log('no');
    res.redirect('/nightlife/login');
  }
}

app.get('/nightlife', function(request, response) {
	response.render('nightlife/index');
});

app.get('/nightlife/login', function(req, res){
    res.render('nightlife/login');
});
  
app.post('/nightlife/login', 
  passport.authenticate('local', { failureRedirect: '/nightlife/login' }),
  function(req, res) {
  	console.log('login success');
    res.redirect('/nightlife');
  });
  
app.get('/nightlife/logout', function(req, res){
    req.logout();
    res.redirect('/nightlife');
});

app.get('/nightlife/register', function(req, res){
	res.render('nightlife/register');
});

app.get('/nightlife/place/:id', function(req, res){
  var place_id = req.params.id.split(':')[1];
  //console.log(place_id);
  res.render('nightlife/item', {place_id: place_id});
});

app.get('/nightlife/user/:id', isLoggedIn, 
  function (req, res) {
  res.json(req.user);
});

app.get('/nightlife/willinglist', isLoggedIn, function(req, res){
  res.render('nightlife/willinglist');
});

var UserHandler = require(path.join(__dirname+'/app/nightlife/controllers/userHandler.js'));
var userHandler = new UserHandler();
app.post('/nightlife/register', userHandler.register);
app.post('/nightlife/addPlace', isLoggedIn, userHandler.addPlace);
app.post('/nightlife/deletePlace', isLoggedIn, userHandler.deletePlace);
app.get('/nightlife/mywills', isLoggedIn, userHandler.getMyWills);
app.get('/nightlife/user/all', userHandler.getUser);

/*-----------Routes for Stock app ends----------------*/

var port = process.env.PORT || 5000;
app.listen(port,  function () {
	console.log('Server listening on port ' + port + '...');
});