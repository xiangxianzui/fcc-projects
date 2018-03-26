var Books = require('../models/books.js');
var qs = require('querystring');
var url = require('url');
var path = require('path');
var fs = require('fs');
//formidable is a node.js module for parsing form data, especially file uploads.
var formidable = require('formidable');

function bookHandler () {

	this.getAllBook = function (req, res){
		var query = Books.find();
		query.exec(function(err, result){
			if(err)	{throw err;}
			res.json(result);
			
		});
	};

	this.getMyBook = function (req, res){
		var userId = req.user._id;
		var query = Books.find({'userid': userId});
		query.exec(function(err, result){
			if(err)	{throw err;}
			res.json(result);
			
		});
	};

	this.getMyTradedBook = function (req, res){
		var userId = req.user._id;
		var status = 'traded';
		var query = Books.find({'userid': userId, 'status': status});
		query.exec(function(err, result){
			if(err)	{throw err;}
			res.json(result);
			
		});
	};

	this.postNewBook = function (req, res){
		if(req.user){//user logged in
			var userId = req.user._id;

			//create an incoming form object
			var form = new formidable.IncomingForm();
			//specify that we don't want user to upload multiple files at the same time; set true to allow.
			form.multiples = false;
			//store uploads in /public/book/thumbnail directory
			form.uploadDir = path.join(process.cwd(), '/public/book/thumbnail');

			//log any occured error
			form.on('error', function(err){
				console.log('File Uploading Error: '+err);
			});

			//parse the incoming request containing form data
			form.parse(req, function(err, fields, files){
				var newBookname = fields.bookname;
				if(newBookname!==null && newBookname!==''){
					//check if the current user has posted a book with the same name
					var query = Books.find({'userid': userId, 'bookname': newBookname});
					query.exec(function(err, result){
						if(err)	{throw err;}
						if(result!==null && result.length!==0){
							res.send('exist');
						}
						else{//current user has not posted a book with same name before
							var file = files['upload[]'];
							var fileType = file.name.split('.')[file.name.split('.').length-1];
							var fileName = userId + "_" + newBookname + "_thumbnail." + fileType;
							//rename the uploaded file as: [userId]_[newBookname]_thumbnail.[fileType]
							fs.rename(file.path, path.join(form.uploadDir, fileName));

							var newThumbnail = fileName;
							if(newThumbnail!==null && newThumbnail!==''){
								var newBook = new Books();
								newBook.bookname = newBookname;
								newBook.userid = userId;
								newBook.thumbnail = newThumbnail;
								newBook.status = 'untraded';
								newBook.save(function(err){
									if(err)	{throw err;}
									res.send('success');
								});
							}
							//console.log("___________ "+fields.bookname);
							//console.log("___________ "+files['upload[]'].name);
						}
					});
				}
			});
			
		}
		else{//not logged in
			res.send('not logged in');
		}
	};

	this.deleteBook = function (req, res){//delete book entry both in database and thumbnail in file system
		var bookname = req.body.bookname;
		var userid = req.body.userid;
		if(bookname!==null && userid!==null && bookname!=='' && userid!==''){
			var query = Books.findOne({'bookname': bookname, 'userid': userid}, {'thumbnail':1, '_id':0});
			query.exec(function(err, result){
				if(err)	{throw err;}
				var deletingFile = result.thumbnail;
				if(deletingFile){
					var deletingFilePath = path.join(process.cwd(), '/public/book/thumbnail/', deletingFile);
					//console.log(deletingFilePath);
					
					fs.unlink(deletingFilePath, function(err){
						if(err)	{throw err;}
						var query1 = Books.remove({'bookname': bookname, 'userid': userid});
						query1.exec(function(err, result){
							if(err)	{throw err;}
							res.send('success');
						});
					});		
				}
			});	
		}	
	};

	this.tradeBook = function (req, res){//update the book status to 'traded' according to bookid
		var bookid = req.body.bookid;
		//console.log(bookid);
		if(bookid!==null && bookid!==''){
			var newStatus = 'traded';
			var query = Books.findOneAndUpdate({'_id': bookid}, {$set: {'status': newStatus}});
			query.exec(function(err, result){
				if(err)	{throw err;}
				res.send('success');
			});	
		}	
	};

	this.untradeBook = function (req, res){//update the book status to 'untraded' according to bookid
		var bookid = req.body.bookid;
		if(bookid!==null && bookid!==''){
			var newStatus = 'untraded';
			var query = Books.findOneAndUpdate({'_id': bookid}, {$set: {'status': newStatus}});
			query.exec(function(err, result){
				if(err)	{throw err;}
				res.send('success');
			});		
		}	
	};


}

module.exports = bookHandler;