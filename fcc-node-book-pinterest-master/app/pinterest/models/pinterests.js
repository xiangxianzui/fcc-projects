//Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
By default (in an effort to minimize data stored in MongoDB), 
Mongoose will not save empty objects to your database. 
You can override this behavior by setting the minimize flag to false when you create your schema
*/
//define Pinterest schema
//thumbnail stores the filename of the pinterest
//'likers' is an array which stores all userid who likes this pinterest
//and 'likers' should not include the owner of this pinterest
var Pinterest = new Schema({
	pinterestname: String,
	thumbnail: String,
	ownerid: String,
	likers: Array
}, {minimize: false});

//mongoose.model('ModelName', mySchema)
module.exports = mongoose.model('Pinterest', Pinterest);