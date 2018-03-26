//Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//define User schema
var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String,
      	publicRepos: Number
	}
});

//mongoose.model('ModelName', mySchema)
module.exports = mongoose.model('User', User);