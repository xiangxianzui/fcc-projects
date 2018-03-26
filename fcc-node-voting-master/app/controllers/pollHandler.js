var Polls = require('../models/polls.js');
var Voted = require('../models/voted.js');
var ObjectId = require('mongodb').ObjectID;
var qs = require('querystring');

function pollHandler () {

	this.getPoll = function (req, res){
		var query = Polls.find();
		query.exec(function(err, result){
			if(err)	{throw err;}
			res.json(result);
		});
	};

	this.getPollById = function (req, res){
		var id = req.params.id.split(':')[1];
		console.log('pollId: '+id);
		var query = Polls.findOne({'_id': id});
		query.exec(function(err, result){
			if(err)	{throw err;}
			var _id = result._id;
			var question = result.question;
			var options = result.options;
			var dateCreated = result.dateCreated;
			var dateLastUpdated = result.dateLastUpdated;
			var involved = result.involved;
			var labels = Object.keys(options);
			var values = [];
			for(var i=0; i<labels.length; i++){
				var key = labels[i];
				values[i] = options[key];
			}
			res.render('item', {_id:_id, question:question, options:options, 
				dateCreated:dateCreated, dateLastUpdated:dateLastUpdated, involved:involved});
			//res.json(result);
		});
	};

	this.getMyPoll = function (req, res) {
		var myId = new ObjectId(req.user._id);
		console.log("userId: "+myId);
		var query = Polls.find({'createBy': myId});
		query.exec(function(err, result){
			if(err)	{throw err;}
			res.render('myvotes', {myvotes: result});
		});
	};

	this.deleteMyPoll = function (req, res) {
		var pollId = req.params.id.split(':')[1];
		console.log('deleting pollId: '+pollId);
		var query = Polls.remove({'_id': pollId});
		query.exec(function(err, result){
			if(err)	{throw err;}
			res.redirect('/myvotes');
		});
	};

	this.createPollOption = function (req, res){
		var body = '';
		req.on('data', function(data){
			body += data;
			//destroy the connection once the client posts too much data!
			if(body.length > 1e6)	{req.connection.destroy();}
		});
		req.on('end', function(){
			var post = qs.parse(body);
			var newOption = post.newOption;
			var pollId = post.pollId;
			//only return the 'options' field and exclude '_id' field
			var query = Polls.findOne({'_id' : pollId}, {'options':1, '_id':0});
			query.exec(function(err, result){
				if(err)	{throw err;}
				var keys = Object.keys(result.options);
				var isNew = true;
				keys.forEach(function(key){
					if(key===newOption){
						isNew = false;
					}
				});
				if(isNew){
					var newOptions = result.options;
					newOptions[newOption] = 0;
					var query1 = Polls.findOneAndUpdate({'_id' : pollId}, {$set: {'options' : newOptions}});
					query1.exec(function(err, result){
						if(err)	{throw err;}
						res.send('success');
					});
				}
				else{
					//the new option is existed
					res.send("'"+newOption+"' has already existed!");
				}
			});
		});
	};

	this.vote = function (req, res){
		var body = '';
		req.on('data', function(data){
			body += data;
			//destroy the connection once the client posts too much data!
			if(body.length > 1e6)	{req.connection.destroy();}
		});
		req.on('end', function(){
			var post = qs.parse(body);
			var voteOption = post.voteOption;
			var pollId = post.pollId;
			var client = (req.isAuthenticated()) ? req.user._id : req.clientIp;
			var now = new Date();
			var interval = 600000;//set the time interval to 600s
			console.log("client: "+client);
			//console.log(now);
			if(client!==undefined && client!==null){
				var votedQuery = Voted.find({'pollId' : pollId, 'client': client}).sort({timestamp : -1});
				votedQuery.exec(function(err, result){
					if(err)	{throw err;}
					//console.log(result);
					if(result.length===0){
						//only return the 'options' field and exclude '_id' field
						var query = Polls.findOne({'_id' : pollId}, {'options':1, '_id':0});
						query.exec(function(err, result){
						if(err)	{throw err;}
						var newOptions = result.options;
						newOptions[voteOption] = newOptions[voteOption]+1;
						var query1 = Polls.findOneAndUpdate({'_id' : pollId}, {$set: {'options' : newOptions}});
						query1.exec(function(err, result){
						if(err)	{throw err;}
						var newVoted = new Voted();
						newVoted.client = client;
						newVoted.pollId = pollId;
						newVoted.timestamp = now;
						newVoted.save(function (err) {
							if (err) {throw err;}
							res.send('success');
						});
					});
				});
					}
					else{
						var lastVoteDate = new Date(result[0].timestamp);
						lastVoteDate = new Date(lastVoteDate.getTime()+interval);
						if(lastVoteDate>now){
							res.send("You(" + client + ")have already voted on this poll within " + interval + " ms!");
						}
						else{
							//only return the 'options' field and exclude '_id' field
							var query = Polls.findOne({'_id' : pollId}, {'options':1, '_id':0});
							query.exec(function(err, result){
								if(err)	{throw err;}
								var newOptions = result.options;
								newOptions[voteOption] = newOptions[voteOption]+1;
								var query1 = Polls.findOneAndUpdate({'_id' : pollId}, {$set: {'options' : newOptions}});
								query1.exec(function(err, result){
									if(err)	{throw err;}
									var newVoted = new Voted();
									newVoted.client = client;
									newVoted.pollId = pollId;
									newVoted.timestamp = now;
									newVoted.save(function (err) {
									if (err) {throw err;}
										res.send('success');
									});
								});
							});
						}
					}
				});
			}
			else{
				//only return the 'options' field and exclude '_id' field
				var query = Polls.findOne({'_id' : pollId}, {'options':1, '_id':0});
				query.exec(function(err, result){
					if(err)	{throw err;}
					var newOptions = result.options;
					newOptions[voteOption] = newOptions[voteOption]+1;
					var query1 = Polls.findOneAndUpdate({'_id' : pollId}, {$set: {'options' : newOptions}});
					query1.exec(function(err, result){
						if(err)	{throw err;}
						var newVoted = new Voted();
						newVoted.client = client;
						newVoted.pollId = pollId;
						newVoted.timestamp = now;
						newVoted.save(function (err) {
							if (err) {throw err;}
							res.send('success');
						});
					});
				});
			}
			
		});
	};

	this.createNewPoll = function (req, res){
		var body = '';
		req.on('data', function(data){
			body += data;
			//destroy the connection once the client posts too much data!
			if(body.length > 1e6)	{req.connection.destroy();}
		});
		req.on('end', function(){
			var post = qs.parse(body);
			var userId = req.user._id;
			var newQuestion = post.pollQuestion;
			var pollOptions = post.pollOptions;
			var newOptions = {};
			pollOptions.split(' * ').forEach(function(option){
				newOptions[option] = 0;
			});
			var newPoll = new Polls();
			newPoll.question = newQuestion;
			newPoll.createBy = userId;
			newPoll.options = newOptions;
			newPoll.save(function (err){
				if(err)	{throw err;}
				else{
					res.send('success');
				}
			});
		});
	};

}

module.exports = pollHandler;