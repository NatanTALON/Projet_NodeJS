var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	login : String,
	psw : String,
	admin : Boolean,
	highscore_list : [{game : String, highscore : Number}],
});

module.exports = mongoose.model('User', userSchema);
