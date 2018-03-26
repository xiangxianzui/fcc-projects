var path = require('path');

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//load timestamp router module and establish route: /timestamp
var timestamp = require('./routers/timestamp/timestamp');
app.use('/timestamp', timestamp);

//load requestinfo router module and establish route: /requestinfo
var requestinfo = require('./routers/requestinfo/requestinfo');
app.use('/requestinfo', requestinfo);

//load urlshortener router module and establish route: /urlshortener
var urlshortener = require('./routers/urlshortener/urlshortener');
app.use('/urlshortener', urlshortener);

//load imagesearcher router module and establish route: /imagesearcher
var imagesearcher = require('./routers/imagesearcher/imagesearcher');
app.use('/imagesearcher', imagesearcher);

//load filemetadata router module and establish route: /filemetadata
var filemetadata = require('./routers/filemetadata/filemetadata');
app.use('/filemetadata', filemetadata);

app.use(express.static(path.join(__dirname + '/home')));

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/home/index.html');
});

app.listen(app.get('port'), function() {
  console.log('master server is running on port', app.get('port'));
});