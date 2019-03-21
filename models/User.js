var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	login : String,
	psw : String,
	highscore_list : [{game : String, highscore : Number}],
});

module.exports = mongoose.model('User', userSchema);
