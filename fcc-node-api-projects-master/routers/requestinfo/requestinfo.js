//request-ip is a node-module which properly retrieves the request ip
var requestIp = require('request-ip');

//useragent is a module to retrieve information of user agent
var useragent = require('useragent');

var path = require('path');

var express = require('express');
var router = express.Router();

//register request-ip as middleware
router.use(requestIp.mw());

router.use(express.static(path.join(__dirname + '/public')));

// define the home page route
router.get('/', function (request, response) {
	response.sendFile(__dirname + '/public/index.html');
});

router.get('/whoami', function(request, response) {
	var ip = request.clientIp;
	var language = request.headers['accept-language'].split(',')[0];
	language = (language===undefined) ? 'en' : language;
	var agent = useragent.parse(request.headers['user-agent']);
	var os = agent.os.toString();
	var json = {
		ip:ip,
		language:language,
		os:os
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