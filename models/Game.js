var mongoose = require('mongoose');

const game = new mongoose.Schema({
	name : String,
	scores : [{Player :String, score : Number}],
});

module.exports = mongoose.model('Game', game);
