/////////////////// require needed middlewares /////////////////////
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const session = require('express-session');



////////// configure app to use express on port 3000///////////////
const app = express();
const port = 3000;

//tell express where to find js sources for games
app.use('/public', express.static(__dirname + '/public'));



///////////// select view engine /////////////////////////
app.set('view engine', 'ejs');



/////////////// tell express to use middlewares ///////////////
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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

var user = {
	name: "admin",
	highscore: 0
};		//a changer


//////////////database connection////
//const mongoose = require('mongoose');
//mongoose.connect('mongodb+srv://RC:B4IgWhoqchuiTm3w@cluster0-uuws7.mongodb.net/projet_NodeJs?retryWrites=true',{useNewUrlParser: true});
/////////////////////////////////////



////////////// login ////////////////
app.get('/Login', function(req, res){
	res.render('login', {badauth: false});
});

app.post('/Login', function(req, res) {
	//check if login and password are ok using database
	if (true) {
		req.session.user = user;
		res.redirect('/secure/GameSelection');
	} else {
		res.render('login', {badauth: true});
	}
});


/////////////subscription//////////
app.get('/Subscription', function(req, res){
	res.render('subscription', {user: user});
});


///////////// game selection //////////////
app.get('/secure/GameSelection', function(req, res){
	res.render('gameList', {gameList: gameList});
});


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
