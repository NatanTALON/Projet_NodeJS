var mongoose = require('mongoose');

var user = new mongoose.Schema({
	login : String,
	psw : String,
	highscore_list : [{game : String, highscore : Number}]
});

module.exports = mongoose.model('User', user);
