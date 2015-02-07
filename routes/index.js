var express = require('express');
var Movie = require('../models/movie');
var Catetory = require('../models/catetory');
var router = express.Router();

// index page
router.get('/', function(req, res) {
    Catetory.findAll(function(err,catetories){
        if(err){
            console.error(err);
            return;
        }
        res.render('index',{
            title:'首页-Welcome to My Website',
            catetories:catetories
        });
    });
});

module.exports = router;