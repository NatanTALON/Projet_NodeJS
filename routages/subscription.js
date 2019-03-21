/*const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const User = mongoose.model('User');


router.get('/', function(req,res){
	res.render('subscription');
});
