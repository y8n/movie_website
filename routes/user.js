var express = require('express');
var User = require('../models/user');
var router = express.Router();

// 获取所有用户列表
router.get('/user/list',signinRequired,adminRequired,function(req,res){
	var page = req.query.p  || 1;
    var count = 6;
    var index = (page-1) * count;
	User.findAll(function(err,users){
    	if(err){
    		console.error(err);
    		return;
    	}
    	var len = users.length;
        var results = users.splice(index,count);
    	res.render('userlist',{
            title:'用户列表',
            users:results,
            currentPage:page,
            totalPage:Math.ceil(len/count)
        });
    })
});
// 用户注册
router.post('/user/signup', function(req, res) {
	var _user = new User(req.body);
	_user.insert(function(err,user){
		if(err){
			console.log(err);
			return;
		}else if(user.message){//用户已经存在
			res.send({
				success:false,
				msg:'用户已经存在，请登录！'
			});	
		}else{
			console.log('Insert success');
			req.session.user= user; //直接登录
			res.send({
				success:true,
				msg:'注册成功！',
				pathname:req.session.preUrl[1]
			});
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
			res.redirect(req.session.preUrl[1]);
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
	res.redirect(req.session.preUrl[1]);
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
