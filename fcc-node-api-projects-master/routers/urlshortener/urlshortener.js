//glabal variable url_pairs contains original url and shortened url
var url_pairs = {};
url_pairs.origin_url = null;
url_pairs.short_url = null;
url_pairs.origin_tail = '';
url_pairs.short_tail = '';

var url = require('url');
var path = require('path');
//use 'open' module to open a file or url in the user's preferred application
var open = require('open');

var express = require('express');
var router = express.Router();

router.use(express.static(path.join(__dirname + '/public')));

// define the home page route
router.get('/', function (request, response) {
	response.render('urlshortener/pages/index');
});

router.get('/favicon.ico', function(request, response){
	response.sendStatus(200);
});

router.get('/*', function(request, response){
	var regex = "https?:\/\/(www.)?([a-zA-Z]+.)([a-zA-Z]+)";
	var pathname = url.parse(request.url, true).pathname;
	pathname = pathname.slice(1,pathname.length);
	console.log("pathname: "+pathname);
	console.log("short_tail: "+url_pairs.short_tail);
	if(url_pairs.origin_url!==null && url_pairs.short_url!==null){
		if(pathname===url_pairs.short_tail+''){
			console.log("yes");
			var redirect = url_pairs.origin_tail;
			response.render('urlshortener/pages/redirect', {redirect:redirect});
			open(redirect);
		}
		else{
			console.log("no");
			var origin_url = request.protocol + "://" +request.get('host') + request.originalUrl;
			console.log("origin: "+origin_url);
			var short_url;
			if(pathname.match(regex)){
				console.log("match");
				var short_tail = getShort();
				short_url = request.protocol + "://" +request.get('host') + "/urlshortener/" + short_tail;
				url_pairs.origin_url = origin_url;
				url_pairs.short_url = short_url;
				url_pairs.origin_tail = pathname;
				url_pairs.short_tail = short_tail;
				response.render('urlshortener/pages/result', {origin_url:origin_url, short_url:short_url});
			}
			else{
				console.log("not match");
				short_url = null;
				url_pairs.origin_url = null;
				url_pairs.short_url = null;
				url_pairs.origin_tail = '';
				url_pairs.short_tail = '';
				response.render('urlshortener/pages/result', {origin_url:origin_url, short_url:short_url});
			}
		}
	}
	else{
		var origin_url = request.protocol + "://" +request.get('host') + request.originalUrl;
		console.log("origin: "+origin_url);
		var short_url;
		if(pathname.match(regex)){
			console.log("match");
			var short_tail = getShort();
			short_url = request.protocol + "://" +request.get('host') + "/urlshortener/" + short_tail;
			url_pairs.origin_url = origin_url;
			url_pairs.short_url = short_url;
			url_pairs.origin_tail = pathname;
			url_pairs.short_tail = short_tail;
			response.render('urlshortener/pages/result', {origin_url:origin_url, short_url:short_url});
		}
		else{
			console.log("not match");
			short_url = null;
			url_pairs.origin_url = null;
			url_pairs.short_url = null;
			url_pairs.origin_tail = '';
			url_pairs.short_tail = '';
			response.render('urlshortener/pages/result', {origin_url:origin_url, short_url:short_url});
		}
	}
	
	
});

function getShort(){
	var start = 1000;
	var end = 9999;
	return Math.floor(start + Math.random()*(end-start+1));
}

module.exports = router;