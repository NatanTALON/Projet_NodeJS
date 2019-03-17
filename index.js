const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));


///////////////dataBase Connection //
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://RC:B4IgWhoqchuiTm3w@cluster0-uuws7.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("ProjetNode").collection("Users");
  collection.createIndex( { "login":"String" }, function(err, result) {
   console.log(result);
});
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


//////////////select view engine///
app.set('view engine', 'ejs')



//////////////login////////////////
app.get('/Login', function(req, res){
	res.render('login', {user: user});
})

/////////////subscription//////////
app.get('/Subscription', function(req, res){
	res.render('subscription', {user: user});
})



/////////////gameSelection/////////
app.get('/GameSelection', function(req, res){
	res.render('gameList', {gameList: gameList});
})

app.post('/GameSelection', function(req, res){
	res.render('gameList', {gameList: gameList});
})


/////////////spaceGame////////////
app.get('/SpaceGame', function(req, res){		//ne marche pas => trouve pas les sources
	res.render('spaceGame', {user: user});
})


/////////////random//////////////
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


app.listen(port, () => console.log('version alpha'))
