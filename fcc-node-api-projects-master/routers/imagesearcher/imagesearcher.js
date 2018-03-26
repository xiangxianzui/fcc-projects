//global variable to hold the query and offset of latest request
var latest = {};
latest.query = '';
latest.offset = '';
latest.result = [];

var url = require('url');
var path = require('path');
//request module
var request_mod = require('request');

var express = require('express');
var router = express.Router();

router.use(express.static(path.join(__dirname + '/public')));

// define the home page route
router.get('/', function (request, response) {
	response.render('imagesearcher/pages/index');
});

//handle the request for favicon.ico by browser
router.get('/favicon.ico', function(request, response){
	response.sendStatus(200);
});

router.get('/latest', function(request, response){
	if(latest.query!=='' && latest.offset!==''){
		var response_data = '';
		var result = latest.result;
		for(var i=0; i<result.length; i++){
			var json = {};
			json.name = result[i].name;
			json.hostPageDisplayUrl = result[i].hostPageDisplayUrl;
			json.thumbnailUrl = result[i].thumbnailUrl;
			response_data += JSON.stringify(json);
		}
		response.end(response_data);
	}
	else{
		var response_data = '<p>No results to display.</p>';
		response.end(response_data);
	}
});

router.get('/imagesearch', function(request, response){
	var search_result = [];
	var pathname = url.parse(request.url, true).pathname;
	var query = url.parse(request.url, true).query;
	//console.log(pathname);
	//console.log(query);
	var q = query['q'];
	var offset = query['offset'];
	latest.query = q;
	latest.offset = offset;

	var api = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?q="+q+"&offset="+offset+"&count=10&mkt=en-us&safeSearch=Moderate";
	var api_key = "75c171544ebb47729e1d3977cfaeddeb";
	//console.log(api);
	var options = {
		url: api,
		headers:{
			"Content-Type":"multipart/form-data",
			"Ocp-Apim-Subscription-Key":api_key
		}
	};
	request_mod(options, function(error, res, body){
		if(!error && res.statusCode==200){
			var info = JSON.parse(body);
			var total_count = info.totalEstimatedMatches;
			if(offset>=total_count){
				console.log("No more pics");
				search_result = [];
				latest.result = search_result;
			}
			else{
				search_result = info.value;
				latest.result = search_result;
				console.log(search_result[0].name);
				response.render('imagesearcher/pages/search', {search_result:search_result});
				/*
				var items = info.value;
				for(var i=0; i<items.length; i++){
					var img_name = items[i].name;
					var img_url = items[i].thumbnailUrl;
					var img_cxt_url = items[i].hostPageDisplayUrl;
				}
				*/
			}
			
			
		}
		else{
			console.log('Bing Search API is not available now.');
			search_result = [];
			latest.result = search_result;
			response.render('imagesearcher/pages/search', {search_result:search_result});
		}
	});
	
});

module.exports = router;