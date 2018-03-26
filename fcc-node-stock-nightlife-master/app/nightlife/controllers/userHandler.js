var Users = require('../models/users.js');
var qs = require('querystring');
var url = require('url');

function userHandler () {

	this.getUser = function (req, res){
		var query = Users.find();
		query.exec(function(err, result){
			if(err)	{throw err;}
			res.json(result);
			
		});
	};

	this.getMyWills = function (req, res){
		var query = Users.findOne({'_id': req.user._id}, {'places':1, '_id':0});
		query.exec(function(err, result){
			if(err)	{throw err;}
			res.json(result.places);
			
		});
	};

	this.register = function (req, res){
		var newUsername = req.body.username;
		var newPassword = req.body.password;
		//var newPlaces = {};
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
					//newUser.place = newPlaces;
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

	this.addPlace = function (req, res){
		var placeId = req.body.placeId;
		var placeName = req.body.placeName;
		var userId = req.user._id;
		//console.log("user id: "+userId);
		if(placeId!==null && placeId!==''){
			var query = Users.findOne({'_id': userId}, {'places':1, '_id':0});
			query.exec(function(err, result){
				if(err)	{throw err;}
				//console.log(result);
				var keys = Object.keys(result.places);
				var isNew = true;
				keys.forEach(function(key){
					if(key===placeId){
						isNew = false;
					}
				});
				if(isNew){
					var newPlaces = result.places;
					newPlaces[placeId] = placeName;
					var query1 = Users.findOneAndUpdate({'_id' : userId}, {$set: {'places' : newPlaces}});
					query1.exec(function(err, result){
						if(err)	{throw err;}
						res.send('success');
					});
				}
				else{
					//the new option is existed
					res.send("'"+placeId+"' is already in your willing list!");
				}
			});
		}
		else{
			res.send('fail');
		}
	};

	this.deletePlace = function (req, res){
		var placeId = req.body.placeId;
		var userId = req.user._id;
		//console.log("user id: "+userId);
		if(placeId!==null && placeId!==''){
			var query = Users.findOne({'_id': userId}, {'places':1, '_id':0});
			query.exec(function(err, result){
				if(err)	{throw err;}
				//console.log(result);
				var keys = Object.keys(result.places);
				var newPlaces = {};
				keys.forEach(function(k){
					if(k!==placeId){
						newPlaces[k] = result.places[k];
					}
				});
				var query1 = Users.findOneAndUpdate({'_id' : userId}, {$set: {'places' : newPlaces}});
				query1.exec(function(err, result){
					if(err)	{throw err;}
					res.send('success');
				});
			});
		}
		else{
			res.send('fail');
		}
	};


}

module.exports = userHandler;