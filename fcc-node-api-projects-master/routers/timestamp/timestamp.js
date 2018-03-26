var moment = require('moment');
var path = require('path');
var express = require('express');
var router = express.Router();

router.use(express.static(path.join(__dirname + '/public')));

// define the home page route
router.get('/', function (request, response) {
	response.sendFile(__dirname + '/public/index.html');
});
// define the service route
router.get('/:param', function(request, response) {
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

module.exports = router;