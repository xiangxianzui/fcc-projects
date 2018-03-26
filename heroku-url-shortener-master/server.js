//glabal variable url_pairs contains original url and shortened url
var url_pairs = {};
url_pairs.origin_url = null;
url_pairs.short_url = null;
url_pairs.origin_tail = '';
url_pairs.short_tail = '';

var url = require('url');
//use 'open' module to open a file or url in the user's preferred application
var open = require('open');

var express = require('express');
var app = express();

app.set('port', process.env.PORT || 5000);

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('pages/index');
});

app.get('/favicon.ico', function(request, response){
	response.send(200);
});

app.get('/*', function(request, response){
	var regex = "https?:\/\/(www.)?([a-zA-Z]+.)([a-zA-Z]+)";
	var pathname = url.parse(request.url, true).pathname;
	pathname = pathname.slice(1,pathname.length);
	console.log("pathname: "+pathname);
	console.log("short_tail: "+url_pairs.short_tail);
	if(url_pairs.origin_url!==null && url_pairs.short_url!==null){
		if(pathname===url_pairs.short_tail+''){
			console.log("yes");
			var redirect = url_pairs.origin_tail;
			response.render('pages/redirect', {redirect:redirect});
			open(redirect);
		}
		else{
			console.log("no");
			var origin_url = request.protocol + "://" +request.get('host') + "/" + pathname;
			console.log("origin: "+origin_url);
			var short_url;
			if(pathname.match(regex)){
				console.log("match");
				var short_tail = getShort();
				short_url = request.protocol + "://" +request.get('host') + "/" + short_tail;
				url_pairs.origin_url = origin_url;
				url_pairs.short_url = short_url;
				url_pairs.origin_tail = pathname;
				url_pairs.short_tail = short_tail;
				response.render('pages/result', {origin_url:origin_url, short_url:short_url});
			}
			else{
				console.log("not match");
				short_url = null;
				url_pairs.origin_url = null;
				url_pairs.short_url = null;
				url_pairs.origin_tail = '';
				url_pairs.short_tail = '';
				response.render('pages/result', {origin_url:origin_url, short_url:short_url});
			}
		}
	}
	else{
		var origin_url = request.protocol + "://" +request.get('host') + "/" + pathname;
		console.log("origin: "+origin_url);
		var short_url;
		if(pathname.match(regex)){
			console.log("match");
			var short_tail = getShort();
			short_url = request.protocol + "://" +request.get('host') + "/" + short_tail;
			url_pairs.origin_url = origin_url;
			url_pairs.short_url = short_url;
			url_pairs.origin_tail = pathname;
			url_pairs.short_tail = short_tail;
			response.render('pages/result', {origin_url:origin_url, short_url:short_url});
		}
		else{
			console.log("not match");
			short_url = null;
			url_pairs.origin_url = null;
			url_pairs.short_url = null;
			url_pairs.origin_tail = '';
			url_pairs.short_tail = '';
			response.render('pages/result', {origin_url:origin_url, short_url:short_url});
		}
	}
	
	
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function getShort(){
	var start = 1000;
	var end = 9999;
	return Math.floor(start + Math.random()*(end-start+1));
}