var express = require('express');
var Comment = require('../models/comment');
var router = express.Router();

router.post('/admin/comment',signinRequired,function(req,res){
	var _comment = new Comment(req.body);
	_comment.save(function(err,comment){
		if(err){
			console.log(err);
			return;
		}
		console.log("Comment insert success");
		res.redirect('/movie/'+_comment.movieId);
	});

})

function signinRequired(req,res,next){
	var user = req.session.user;
	if(!user){
		return res.redirect('/signin');
	}
	next();
} 

module.exports = router;