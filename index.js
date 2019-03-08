const bodyParser = require('body-parser')
const express = require('express')
const ejs = require('ejs')
const app = express()
const port = 3000

const gameList = [{name: "Space Game", href: `http://localhost:${port}/SpaceGame`}];

//select view engine
app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.get('/GameSelection', function(req, res){
	res.render('gameList', {gameList: gameList});
})

app.get('/SpaceGame', function(req, res){
	res.render('spaceGame', {user: user});
})


app.listen(port, () => console.log('version alpha'))
