var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/user/list',signinRequired,adminRequired,function(req,res){
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
			console.log(doc.message); //用户已经存在
			res.redirect('/signin');	
		}else{
			console.log('Insert success');
			res.redirect('/user/list');
		}
	});

});

// 用户登陆
router.post('/user/signin',function(req,res){
	var _user = new User(req.body);
	_user.comparePassword(function(err,isMatch,user){
		if(err){
			console.error(err);
			return;
		}
		if(isMatch){
			console.log('Signin success');
			req.session.user= user;
			res.redirect('/user/list');
		}else{
			console.log('failed')
			//res.json({success:false,msg:"用户名或密码错误"})
			res.redirect('/signin');
		}
	})
});
// 用户登出
router.get('/logout',function(req,res){
	delete req.session.user;
	res.redirect('/');
});

// 用户登录成功现实页面
router.get('/signin',function(req,res){
	var user = req.session.user;
	if(user){
		return res.redirect('/')
	}
	res.render('signin',{
		title:"登录"
	});
});
// 用户登录成功现实页面
router.get('/signup',function(req,res){
	var user = req.session.user;
	if(user){
		return res.redirect('/')
	}
	res.render('signup',{
		title:"注册"
	});
});
//需要用户登录
function signinRequired(req,res,next){
	var user = req.session.user;
	if(!user){
		return res.redirect('/signin');
	}
	next();
} 
// 需要管理员权限
function adminRequired(req,res,next){
	var user = req.session.user;
	if(!user.role || user.role <= 10){
		return res.redirect('/signin');
	}
	next();
}















module.exports = router;
