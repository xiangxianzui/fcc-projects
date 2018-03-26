//Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
By default (in an effort to minimize data stored in MongoDB), 
Mongoose will not save empty objects to your database. 
You can override this behavior by setting the minimize flag to false when you create your schema
*/
//define User schema
var User = new Schema({
	username: String,
	password: String,
	city: String,
	country: String,
	avatar: String
});

//mongoose.model('ModelName', mySchema)
module.exports = mongoose.model('User', User);