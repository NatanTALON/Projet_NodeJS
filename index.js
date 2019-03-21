//require needed middlewares
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
require('./models/User');
require('./models/Game');

//////////////database connection////
mongoose.connect('mongodb+srv://RC:B4IgWhoqchuiTm3w@cluster0-uuws7.mongodb.net/projet_NodeJs?retryWrites=true',{useNewUrlParser: true});
/////////////////////////////////////

const User = mongoose.model('User');
const Game = mongoose.model('Game');

//configure app to use express on port 3000
const app = express();
const port = 3000;

//tell app to use imported middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cookieParser());
app.use(expressValidator())

//creating middleware for session handling using cookies
app.use(function (req, res, next) {
	var cookie = req.cookies.login;
	if (req.url !== '/Login' && cookie === undefined) {
		res.redirect('/Login');
	} else {
		next();
	}
});

//tell express where to find js sources for games
app.use('/public', express.static(__dirname + '/public'));


//select view engine
app.set('view engine', 'ejs')



var gameList = [
	{name: "Space Game", href: `/SpaceGame`, highscore: 0},
	{name: "Random", href: `/Random`, highscore: 0}
];

var user = {
	name: "admin",
	highscore: 0
};		//a changer




////////////// login ////////////////
app.get('/Login', function(req, res){
	res.render('login');
})

app.post('/Login', function(req, res){
	//check if login and password are ok
	console.log(req.body.login);
	console.log(req.body.psw);
	res.cookie('login', req.body.login, { maxAge: 60*60*24*1000 });
	User.findOne({
		login : req.body.login
	}, function(err,user){
		if(!user){
			res.render('login');
			console.log("login doesn't exist");
		}
		else{
			bcrypt.compare(req.body.psw , user.psw, function(err, checked){
			if(checked){
				res.redirect('/GameSelection');
			}
			else{
				res.render('login');
				console.log("wrong password");
				}
			});
		}
	});
})


/////////////subscription//////////
app.get('/Subscription', function(req, res){
	res.render('subscription');
})

app.post('/Subscription', function(req,res){
	req.checkBody('login', 'Please insert a login.').notEmpty();
   req.checkBody('psw', 'Please insert a password.').notEmpty();
	User.findOne({
		login : req.body.login
	}, function(err,user){
		if(!user){
			console.log(req.body.login, req.body.psw);
			const new_user = new User({login : req.body.login, psw : req.body.psw, admin : false, highscore_list : []});
			bcrypt.hash(new_user.psw, 10, function(err,hash){
				new_user.psw = hash;
				new_user.save(function (err) {
	  				if (err) { throw err; }
	 					 console.log('err');
				});
			});
			res.redirect('/GameSelection');
		}
		else{
			res.render('subscription');
			console.log("pseudo déjà utilisé");
		}
	})
});


///////////// game selection //////////////
app.get('/GameSelection', function(req, res){
	res.render('gameList', {gameList: gameList});
})

app.get('/GameSelection', function(req, res){
	res.render('gameList', {gameList: gameList});
})


//////////// game random ///////////////
app.get('/Random', function(req, res){
	res.render('random', {user: user});
})

app.post('/Random', function(req, res){
	score = req.body.score;
	if(user.highscore < score) {
		user.highscore = score;
	}
	res.render('random', {user: user});
})


//////////// game space shooter ///////////
app.get('/SpaceGame', function(req, res){		//ne marche pas => trouve pas les sources
	res.render('spaceGame', {user: user});
})



app.listen(port, () => console.log('version alpha'))

module.exports = app;
