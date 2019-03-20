var mongoose = require('mongoose');

const game = new mongoose.Schema({
	name : String,
	highscore_author : String,
	highscore : Number,
});

module.exports = mongoose.model('Game', game);
