var file_info = {};
file_info.name = '';
file_info.size = '';
file_info.type = '';

//formidable is a node.js module for parsing form data, especially file uploads.
var formidable = require('formidable');

var path = require('path');
var fs = require('fs');

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
	response.sendStatus(200);
});

app.post('/upload', function(request, response){
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

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});