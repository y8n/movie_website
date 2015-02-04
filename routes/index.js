var express = require('express');
var Movie = require('../models/movie');
var router = express.Router();

// index page
router.get('/', function(req, res) {
    Movie.findAll(function(err,doc){
    	if(err){
    		console.error(err);
    		return;
    	}
    	res.render('index',{
            title:'首页-Welcome to My Website',
            movies:doc
        });
    })
});

module.exports = router;