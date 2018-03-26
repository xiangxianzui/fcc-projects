//Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//define Stock schema
var Stock = new Schema({
	symbol: String
});

//mongoose.model('ModelName', mySchema)
module.exports = mongoose.model('Stock', Stock);