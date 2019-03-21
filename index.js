/////////////////// require needed middlewares /////////////////////
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const session = require('express-session');
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


////////// configure app to use express on port 3000///////////////
const app = express();
const port = 3000;

//tell express where to find js sources for games
app.use('/public', express.static(__dirname + '/public'));



///////////// select view engine /////////////////////////
app.set('view engine', 'ejs');



/////////////// tell express to use middlewares ///////////////
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(expressValidator());

//session handling using cookies
app.use(session({
	secret: 'ojzfFv5zcHfD',
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 4*60*60*1000,	//a session last 4 hours
	}
}));

//middleware to check if the user is logged in
app.use((req, res, next) => {
	var url = req.url.split('/');
	if (url.length < 2 || (url[1] === 'secure' && (!req.session || !req.session.user))) {
		res.redirect('/Login');
	} else {
		next();
	}
});



/////////////// temporaire ///////////////////////
var gameList = [
	{name: "Space Game", href: '/secure/SpaceGame', highscore: 0},
	{name: "Random", href: '/secure/Random', highscore: 0}
];



////////////// login ////////////////
app.get('/Login', function(req, res){
	res.render('login', {badauth: false});
});


app.post('/Login', function(req, res){
	//check if login and password are ok
	User.findOne({
		login : req.body.login
	}, function(err,user){
		if(!user){
			res.render('login', {badauth: true});
		} else {
			bcrypt.compare(req.body.psw , user.psw, function(err, checked){
				if(checked){
					req.session.user = user;
					if(req.body.login != "admin"){
						res.redirect('/secure/GameSelection');
					} else {
						res.redirect('/secure/Admin');
					}
				} else {
					res.render('login', {badauth: true});
				}
			});
		}
	});
});


/////////////subscription//////////
app.get('/Subscription', function(req, res){
	res.render('subscription', {loginused: false});
});


app.post('/Subscription', function(req,res){
	req.checkBody('login', 'Please insert a login.').notEmpty();
   	req.checkBody('psw', 'Please insert a password.').notEmpty();
	User.findOne({
		login : req.body.login
	}, function(err,user) {
		if(!user){
			const new_user = new User({login : req.body.login, psw : req.body.psw, admin : false, highscore_list : []});
			bcrypt.hash(new_user.psw, 10, function(err,hash){
				new_user.psw = hash;
				new_user.save(function (err) {
	  				if (err) {
	  					throw err;
	 					console.log('err');
	 				}
				});
			});
			req.session.user = user;
			res.redirect('/secure/GameSelection');
		}
		else{
			res.render('subscription', {loginused: true});
		}
	})
});



//////////// logout //////////////////////
app.post('/logout', function(req,res) {
	res.clearCookie('connect.sid');
	res.redirect('/Login');
});


///////////// game selection //////////////
app.get('/secure/GameSelection', function(req, res){
	res.render('gameList', {gameList: gameList, login: req.session.user.login});
});


/////////////admin users gestion //////////
app.get('/secure/Admin', function(req, res){
	res.render('admin');
})



//////////// game random ///////////////
app.get('/secure/Random', function(req, res){
	res.render('random', {user: req.session.user});
});

app.post('/secure/Random', function(req, res){
	score = req.body.score;
	if(req.session.user.highscore < score) {
		req.session.user.highscore = score;
	}
	res.render('random', {user: req.session.user});
});


//////////// game space shooter ///////////
app.get('/secure/SpaceGame', function(req, res){		//ne marche pas => trouve pas les sources
	res.render('spaceGame', {user: req.session.user});
})



app.listen(port, () => console.log('version alpha'))

module.exports = app;
