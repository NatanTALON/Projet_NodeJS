const bodyParser = require('body-parser')
const express = require('express')
const ejs = require('ejs')
const app = express()
const port = 3000

const gameList = [
	{name: "Space Game", href: `/SpaceGame`, highscore: 0},
	{name: "Random", href: `http://localhost:${port}/Random`, highscore: 0}
];

var user = {
	name: "admin",
	highscore: 0
};		//a changer

//select view engine
app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/GameSelection', function(req, res){
	res.render('gameList', {gameList: gameList});
})

app.get('/SpaceGame', function(req, res){		//ne marche pas => trouve pas les sources
	res.render('spaceGame', {user: user});
})

app.get('/Random', function(req, res){			//a faire
	res.render('random', {user: user});
})

app.post('/Random', function(req, res){
	/*score = req.body.score;
	console.log('coucou');
	if(user.highscore < score) {
		user.highscore = score;
	}*/
	user.highscore = 7;
	res.render('gameList', {user: user});
})


app.listen(port, () => console.log('version alpha'))
