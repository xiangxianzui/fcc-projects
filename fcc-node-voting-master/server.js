//request-ip is a node-module which properly retrieves the request ip
var requestIp = require('request-ip');
var express = require('express');
var passport = require('passport');
var path = require('path');
var github_passport = require('./app/config/passport');
var session = require('express-session');
//'dotenv' is a module which loads environment variables 
//form a .env file into process.env
require('dotenv').load();
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);
//mongoose.Promise = global.Promise;

var app = express();

// views is directory for all template files
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(session({
	secret: 'xiangxianzui',
	resave: false,
	saveUninitialized: true
}));

//register request-ip as middleware
app.use(requestIp.mw());

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));

github_passport(passport);
//configure passport.initialize() middleware
app.use(passport.initialize());
//use persistent login session
app.use(passport.session());

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


app.get('/', isLoggedIn, function(request, response) {
	response.render('index');
});

app.get('/index', function(request, response) {
	response.render('index');
});

app.get('/login', function(request, response){
	response.render('login');
});

app.get('/logout', function(request, response) {
	request.logout();
	response.redirect('/login');
});

app.get('/profile', isLoggedIn, function(request, response) {
	response.render('profile');
});

//Use passport.authenticate(), specifying the 'github' strategy, to authenticate requests
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', 
	passport.authenticate('github', { failureRedirect: '/login' }),
	function(req, res) {
		console.log('login success');
    	// Successful authentication, redirect home.
    	res.redirect('/');
	});

app.get('/user/:id', isLoggedIn, 
	function (req, res) {
	res.json(req.user.github);
});


var PollHandler = require(path.join(__dirname+'/app/controllers/pollHandler.js'));
var pollHandler = new PollHandler();
app.get('/poll/all', pollHandler.getPoll);
app.get('/poll/:id', pollHandler.getPollById);
app.get('/myvotes', isLoggedIn, pollHandler.getMyPoll);
app.get('/myvotes/delete/:id', isLoggedIn, pollHandler.deleteMyPoll);
app.post('/poll/create/option', isLoggedIn, pollHandler.createPollOption);
app.post('/poll/vote', pollHandler.vote);
app.post('/poll/create/new', isLoggedIn, pollHandler.createNewPoll);

var port = process.env.PORT || 5000;
app.listen(port,  function () {
	console.log('Server listening on port ' + port + '...');
});