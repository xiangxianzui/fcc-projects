//Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
By default (in an effort to minimize data stored in MongoDB), 
Mongoose will not save empty objects to your database. 
You can override this behavior by setting the minimize flag to false when you create your schema
*/
//define Book schema
//status = ['traded', 'untraded']
//thumbnail stores the filename of the book poster
var Book = new Schema({
	bookname: String,
	userid: String,
	thumbnail: String,
	status: String
});

//mongoose.model('ModelName', mySchema)
module.exports = mongoose.model('Book', Book);