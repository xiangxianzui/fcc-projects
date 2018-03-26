var express = require('express');
var path = require('path');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var User = require('./app/user/models/users.js');
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

/*-----------handling user starts----------------*/
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    //console.log('yes');
    //next() calls the next callback function
    return next();
  } else {
    //console.log('no');
    res.redirect('/login');
  }
}

app.get('/login', function(req, res){
    res.render('login');
});
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
  	console.log('login success');
    res.redirect('/');
  });
  
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/register', function(req, res){
	res.render('register');
});

app.get('/profile', isLoggedIn, function(req, res){
  res.render('profile', {userid: req.user._id});
});

app.get('/user/:id', isLoggedIn, function(req, res){
  res.json(req.user);
});

var UserHandler = require(path.join(__dirname+'/app/user/controllers/userHandler.js'));
var userHandler = new UserHandler();
app.post('/user/getUserById', userHandler.getUserById);
app.post('/user/updateSetting', userHandler.updateSetting);
app.post('/user/updatePassword', userHandler.updatePassword);
app.post('/user/uploadAvatar', userHandler.uploadAvatar);
app.post('/register', userHandler.register);

/*-----------handling user ends----------------*/

/*-----------routes of Book app starts---------------*/
app.get('/book', function(req, res){
  res.render('book/index');
});
app.get('/book/mybooks', isLoggedIn, function(req, res){
  res.render('book/mybooks');
});
var BookHandler = require(path.join(__dirname+'/app/book/controllers/bookHandler.js'));
var bookHandler = new BookHandler();
app.get('/book/getAll', bookHandler.getAllBook);
app.get('/book/getMy', bookHandler.getMyBook);
app.get('/book/getMyTraded', bookHandler.getMyTradedBook);
app.post('/book/postNew', bookHandler.postNewBook);
app.post('/book/delete', bookHandler.deleteBook);
app.post('/book/trade', bookHandler.tradeBook);
app.post('/book/untrade', bookHandler.untradeBook);
/*-----------routes of Book app ends---------------*/

/*-----------routes of Pinterest app starts---------------*/
app.get('/pinterest', function(req, res){
  if(req.user){
    res.render('pinterest/index', {userid: req.user._id});
  }
  else{
    res.render('pinterest/index', {userid: '0'});
  }
  
});
var PinterestHandler = require(path.join(__dirname+'/app/pinterest/controllers/pinterestHandler.js'));
var pinterestHandler = new PinterestHandler();
app.get('/pinterest/user/:userid', function(req, res){
  var userid = req.params.userid.split(':')[1];
  res.render('pinterest/user', {userid: userid});
});
app.get('/pinterest/getAll', pinterestHandler.getAllPinterest);
app.post('/pinterest/getById', pinterestHandler.getPinterestById);
app.post('/pinterest/getByUser', pinterestHandler.getPinterestByUser);
app.post('/pinterest/postNew', pinterestHandler.postNewPinterest);
app.post('/pinterest/updateLikers', pinterestHandler.updateLikers);
app.post('/pinterest/delete', pinterestHandler.deletePinterest);
/*-----------routes of Pinterest app ends---------------*/

var port = process.env.PORT || 5000;
app.listen(port,  function () {
	console.log('Server listening on port ' + port + '...');
});