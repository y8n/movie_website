var Movie = require('../models/movie');
exports.index = function(req, res) {
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
}