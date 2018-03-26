var express = require('express');
var path = require('path');
//'dotenv' is a module which loads environment variables 
//from a .env file into process.env
require('dotenv').load();
var fs = require('fs');
//formidable is a node.js module for parsing form data, especially file uploads.
var formidable = require('formidable');
/*------------app configuration starts---------------*/
var app = express();

// views is directory for all template files
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(process.cwd() + '/public'));

/*------------app configuration ends---------------*/

app.get('/', function(request, response) {
	response.render('index');
});

app.post('/upload', function(req, res){
  //create an incoming form object
      var form = new formidable.IncomingForm();
      //specify that we don't want user to upload multiple files at the same time; set true to allow.
      form.multiples = false;
      //store uploads in /uploads directory
      form.uploadDir = path.join(process.cwd(), '/uploads');

      //log any occured error
      form.on('error', function(err){
        console.log('File Uploading Error: '+err);
      });

      //parse the incoming request containing form data
      form.parse(req, function(err, fields, files){
        var file = files['upload[]'];
        //rename the uploaded file as its origin name
        fs.rename(file.path, path.join(form.uploadDir, file.name));
        
        res.send('success');
      });
});

var port = process.env.PORT || 5000;
app.listen(port,  function () {
	console.log('Server listening on port ' + port + '...');
});