const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000

//select view engine
app.set('view engine', 'ejs')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res){
	res.render('gameList', {gameList: gameList});
})
