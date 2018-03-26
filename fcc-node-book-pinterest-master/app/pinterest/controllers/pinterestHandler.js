var Pinterests = require('../models/pinterests.js');
var qs = require('querystring');
var url = require('url');
var path = require('path');
var fs = require('fs');
//formidable is a node.js module for parsing form data, especially file uploads.
var formidable = require('formidable');

function pinterestHandler () {

	this.getAllPinterest = function (req, res){
		var query = Pinterests.find();
		query.exec(function(err, result){
			if(err)	{throw err;}
			res.json(result);
			
		});
	};

	this.getPinterestById = function (req, res){
		var pinterestid = req.body.pinterestid;
		//console.log(pinterestid);
		if(pinterestid!==null && pinterestid!==''){
			var query = Pinterests.findOne({'_id': pinterestid});
			query.exec(function(err, result){
				if(err)	{throw err;}
				res.json(result);
			
			});
		}
		
	};

	this.getPinterestByUser = function (req, res){
		var ownerid = req.body.ownerid;
		//console.log(ownerid);
		if(ownerid!==null && ownerid!==''){
			var query = Pinterests.find({'ownerid': ownerid});
			query.exec(function(err, result){
				if(err)	{throw err;}
				res.json(result);
			});
		}
		
	};

	this.postNewPinterest = function (req, res){
		if(req.user){//user logged in
			var userId = req.user._id;

			//create an incoming form object
			var form = new formidable.IncomingForm();
			//specify that we don't want user to upload multiple files at the same time; set true to allow.
			form.multiples = false;
			//store uploads in /public/pinterest/thumbnail directory
			form.uploadDir = path.join(process.cwd(), '/public/pinterest/thumbnail');

			//log any occured error
			form.on('error', function(err){
				console.log('File Uploading Error: '+err);
			});

			//parse the incoming request containing form data
			form.parse(req, function(err, fields, files){
				var newPinterestname = fields.pinterestname;
				if(newPinterestname!==null && newPinterestname!==''){
					//check if the current user has posted a pinterest with the same name
					var query = Pinterests.find({'ownerid': userId, 'pinterestname': newPinterestname});
					query.exec(function(err, result){
						if(err)	{throw err;}
						if(result!==null && result.length!==0){
							res.send('exist');
						}
						else{//current user has not posted a pinterest with same name before
							var file = files['upload[]'];
							var fileType = file.name.split('.')[file.name.split('.').length-1];
							var fileName = userId + "_" + newPinterestname + "_thumbnail." + fileType;
							//rename the uploaded file as: [userId]_[newPinterestname]_thumbnail.[fileType]
							fs.rename(file.path, path.join(form.uploadDir, fileName));

							var newThumbnail = fileName;
							if(newThumbnail!==null && newThumbnail!==''){
								var newPinterest = new Pinterests();
								newPinterest.pinterestname = newPinterestname;
								newPinterest.ownerid = userId;
								newPinterest.thumbnail = newThumbnail;
								newPinterest.likers = [];
								newPinterest.save(function(err){
									if(err)	{throw err;}
									res.send('success');
								});
							}
						}
					});
				}
			});
			
		}
		else{//not logged in
			res.send('not logged in');
		}
	};

	this.updateLikers = function (req, res){
		var pinterestid = req.body.pinterestid;
		var newLiker = req.body.newLiker;
		//console.log('newLiker: '+ newLiker);
		var query = Pinterests.findOne({'_id': pinterestid}, {'likers':1, '_id':0});
		query.exec(function(err, result){
			if(err)	{throw err;}
			var likers = result.likers;
			likers.push(newLiker);
			var query1 = Pinterests.findOneAndUpdate({'_id': pinterestid}, {$set: {'likers': likers}});
			query1.exec(function(err, result){
				if(err)	{throw err;}
				res.send('success');
			});		
		});
	};

	this.deletePinterest = function (req, res){//delete pinterest entry both in database and thumbnail in file system
		var pinterestid = req.body.pinterestid;
		if(pinterestid!==null && pinterestid!==''){
			var query = Pinterests.findOne({'_id': pinterestid}, {'thumbnail':1, '_id':0});
			query.exec(function(err, result){
				if(err)	{throw err;}
				var deletingFile = result.thumbnail;
				if(deletingFile){
					var deletingFilePath = path.join(process.cwd(), '/public/pinterest/thumbnail/', deletingFile);
					//console.log(deletingFilePath);
					
					fs.unlink(deletingFilePath, function(err){
						if(err)	{throw err;}
						var query1 = Pinterests.remove({'_id': pinterestid});
						query1.exec(function(err, result){
							if(err)	{throw err;}
							res.send('success');
						});
					});		
				}
			});	
		}	
	};

}

module.exports = pinterestHandler;