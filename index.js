//require needed middlewares
const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');

//configure app to use express on port 3000
const app = express();
const port = 3000;

//tell app to use imported middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

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


///////////////dataBase Connection ////////////
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://RC:B4IgWhoqchuiTm3w@cluster0-uuws7.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

/////////////////////////////////////

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
	res.cookie('login', req.body.login, { maxAge: 60*60*24*1000 });
	res.redirect('/GameSelection');
})


/////////////subscription//////////
app.get('/Subscription', function(req, res){
	res.render('subscription', {user: user});
})


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
