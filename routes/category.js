var express = require('express');
var Category = require('../models/category');
var router = express.Router();
// 添加新的电影类型页面
router.get('/admin/category',adminRequired,function(req,res){
	res.render('category',{
		title:'新的添加电影类型'
	});
});
// 添加新的电影类型
router.post('/admin/category/new',adminRequired,function(req,res){
	var category = req.body.category;
	Category.saveCategory(category,function(err,category){
		if(err){
			return console.error(err);
		}
		res.redirect('/admin/category/list');
	})

})
// 显示所有电影类型的列表
router.get('/admin/category/list',adminRequired,function(req,res){
	Category.findAllCategory(function(err,categories){
		res.render('categorylist',{
			title:'电影类型列表',
			categories:categories
		});
	})
})

// 需要管理员登录
function adminRequired(req,res,next){
    var user = req.session.user;
    if(user && user.role && user.role > 10){
         next();
    }else{
    	return res.redirect('/signin');
    }
}
module.exports = router;