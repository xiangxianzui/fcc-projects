//Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//define Poll schema
var Poll = new Schema({
	question: {type: String, required: true},
	options: Object,
	createBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	dateCreated: String,
	dateLastUpdated: String,
	involved: Number
});

//mongoose.model('ModelName', mySchema)
module.exports = mongoose.model('Poll', Poll);