var moment = require('moment');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/public/index.html');
});

app.get('/:param', function(request, response) {
	var input = request.params.param;
	var unix = null;
	var natural = null;
	var json;
	
	// if string contains only digits > coerce and convert to ms
	!isNaN(input) && (input*= 1000);
	// momentjs will warn if we just pass a string, so we'll pass it a date obj
	input = new Date(input);

	if (moment(input).isValid()) {
		natural = moment(input).format('MMMM D, YYYY');
		unix = moment(input).unix();
	}
	json = {
		unix:unix,
		natural:natural
	};

	if(json){
		response.writeHead(200, {'content-type': 'application/json'});
		response.write(JSON.stringify(json));
		response.end();
	}
	else{
		response.writeHead(404);
		response.end();
	}
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});