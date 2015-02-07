var express = require('express');
var Catetory = require('../models/catetory');
var router = express.Router();

router.get('/admin/catetory',adminRequired,function(req,res){
	res.render('catetory',{
		title:'新的添加电影类型'
	});
});
router.post('/admin/catetory/new',adminRequired,function(req,res){
	var catetory = req.body.catetory;
	Catetory.saveCatetory(catetory,function(err,catetory){
		if(err){
			return console.error(err);
		}
		res.redirect('/admin/catetory/list');
	})

})
router.get('/admin/catetory/list',adminRequired,function(req,res){
	Catetory.findAllCatetory(function(err,catetories){
		res.render('catetorylist',{
			title:'电影类型列表',
			catetories:catetories
		});
	})
})
function adminRequired(req,res,next){
    var user = req.session.user;
    if(user && user.role && user.role > 10){
         next();
    }else{
    	return res.redirect('/signin');
    }
}
module.exports = router;