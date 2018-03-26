var express = require('express');
var path = require('path');
//'dotenv' is a module which loads environment variables 
//from a .env file into process.env
require('dotenv').load();

var app = express();

// views is directory for all template files
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(process.cwd() + '/public'));

//add route file
require('./route')(app);

var port = process.env.PORT || 18080;
app.listen(port,  function () {
    console.log('Server listening on port ' + port + '...');
});