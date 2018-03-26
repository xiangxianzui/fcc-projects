var file_info = {};
file_info.name = '';
file_info.size = '';
file_info.type = '';

//formidable is a node.js module for parsing form data, especially file uploads.
var formidable = require('formidable');

var path = require('path');
var fs = require('fs');

var express = require('express');
var router = express.Router();

router.use(express.static(path.join(__dirname + '/public')));

// define the home page route
router.get('/', function (request, response) {
	response.render('filemetadata/pages/index');
});

router.get('/favicon.ico', function(request, response){
	response.sendStatus(200);
});

router.post('/upload', function(request, response){
	console.log('receiving upload');
	//create an incoming form object
	var form = new formidable.IncomingForm();
	//specify that we don't want user to upload multiple files at the same time; set true to allow.
	form.multiples = false;
	//store uploads in /uploads directory
	form.uploadDir = path.join(__dirname, '/uploads');
	//rename the uploaded file to its original name
	form.on('file', function(field, file){
		fs.rename(file.path, path.join(form.uploadDir, file.name));
		file_info.name = file.name;
		file_info.size = file.size;
		file_info.type = file.type;
	});
	//log any occured error
	form.on('error', function(err){
		console.log('Error: '+err);
	});
	//if the upload is finished, return 'success' to client
	form.on('end', function(){
		console.log('upload success');
		response.end(JSON.stringify(file_info));
	});
	//parse the incoming request containing form data
	form.parse(request);
});

module.exports = router;