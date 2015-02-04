var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/user/list',function(req,res){
	User.findAll(function(err,doc){
    	if(err){
    		console.error(err);
    		return;
    	}
    	res.render('userlist',{
            title:'用户列表',
            users:doc
        });
    })
});
// 用户注册
router.post('/user/signup', function(req, res) {
	var _user = new User(req.body);
	_user.insert(function(err,doc){
		if(err){
			console.log(err);
			return;
		}else if(doc.message){
			console.log(doc.message);
			res.redirect('/user/list');
		}else{
			console.log('Insert success');
			res.redirect('/user/list');
		}
	});

});

// 用户登陆
router.post('/user/signin',function(req,res){
	var _user = new User(req.body);
	_user.comparePassword(function(err,isMatch){
		if(err){
			console.error(err);
			return;
		}
		if(isMatch){
			console.log('Signin success');
			req.session.user= _user;
			res.redirect('/user/list');
		}else{
			console.log('failed')
			res.redirect('/');
		}
	})
});
// 用户登出
router.get('/logout',function(req,res){
	delete req.session.user;
	res.redirect('/');
});




module.exports = router;
