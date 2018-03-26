var Users = require('../models/users.js');
var qs = require('querystring');
var url = require('url');
var path = require('path');
var fs = require('fs');
//formidable is a node.js module for parsing form data, especially file uploads.
var formidable = require('formidable');

function userHandler () {

	this.getUser = function (req, res){
		var query = Users.find();
		query.exec(function(err, result){
			if(err)	{throw err;}
			res.json(result);
			
		});
	};

	this.getUserById = function (req, res){
		var userid = req.body.userid;
		if(userid!==null && userid!==''){
			var query = Users.findOne({'_id': userid});
			query.exec(function(err, result){
				if(err)	{throw err;}
				res.json(result);
			
			});
		}
	};

	this.register = function (req, res){
		var newUsername = req.body.username;
		var newPassword = req.body.password;
		if(newUsername!==null && newPassword!==null && newUsername!=='' && newPassword!==''){
			var query = Users.find({'username': newUsername});
			query.exec(function(err, result){
				if(err)	{throw err;}
				//console.log(result);
				if(result!==null && result.length!==0){
					res.send('exist');
				}
				else{
					var newUser = new Users();
					newUser.username = newUsername;
					newUser.password = newPassword;
					newUser.city = '';
					newUser.country = '';
					newUser.avatar = 'default_avatar.png';
					newUser.save(function(err){
						if(err)	{throw err;}
						res.send('success');
					});
				}
			});
		}
		else{
			res.send('fail');
		}
	};

	this.updateSetting = function (req, res){
		var newCity = req.body.city;
		var newCountry = req.body.country;
		var userId = req.user._id;
		if(newCity!==null && newCountry!==null){
			var query = Users.findOneAndUpdate({'_id': userId}, {$set: {'city': newCity, 'country': newCountry}});
			query.exec(function(err, result){
				if(err)	{throw err;}
				res.send('success');
			});
		}
		else{
			res.send('fail');
		}
	};

	this.updatePassword = function (req, res){
		var oldPsw = req.body.oldPsw;
		var newPsw = req.body.newPsw;
		var userId = req.user._id;
		if(oldPsw!==null && newPsw!==null){
			var query = Users.findOne({'_id': userId}, {'password':1, '_id':0});
			query.exec(function(err, result){
				if(err)	{throw err;}
				if(oldPsw===result.password){
					var query1 = Users.findOneAndUpdate({'_id': userId}, {$set: {'password': newPsw}});
					query1.exec(function(err, result){
						if(err)	{throw err;}
						res.send('success');
					});
				}
				else{
					res.send('oldPsw wrong');
				}
			});
		}
		else{
			res.send('fail');
		}
	};

	this.uploadAvatar = function (req, res){
		var userId = req.user._id;
		//create an incoming form object
		var form = new formidable.IncomingForm();
		//specify that we don't want user to upload multiple files at the same time; set true to allow.
		form.multiples = false;
		//store uploads in /public/user/avatar directory
		form.uploadDir = path.join(process.cwd(), '/public/user/avatar');
		//rename the uploaded file as: [userId]_avatar.[fileType]
		//then, update avatar in database
		form.on('file', function(field, file){
			var fileType = file.name.split('.')[file.name.split('.').length-1];
			var fileName = userId + "_avatar." + fileType;
			fs.rename(file.path, path.join(form.uploadDir, fileName));

			var query = Users.findOneAndUpdate({'_id': userId}, {$set: {'avatar': fileName}});
			query.exec(function(err, result){
				if(err)	{throw err;}
			});
		});
		//log any occured error
		form.on('error', function(err){
			console.log('File Uploading Error: '+err);
		});
		//if the upload is finished, return 'success' to client
		form.on('end', function(){
			console.log('avatar uploaded success');
			res.send('success');
		});
		//parse the incoming request containing form data
		form.parse(req);
	};

}

module.exports = userHandler;