//Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//define Voted schema
//Is used to record the who(clientip or userid), on which poll(pollId), and when(the timestamp of voting)
var Voted = new Schema({
	client: String,
	pollId: String,
	timestamp: Date
});

//mongoose.model('ModelName', mySchema)
module.exports = mongoose.model('Voted', Voted);