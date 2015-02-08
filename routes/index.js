var express = require('express');
var Movie = require('../models/movie');
var Catetory = require('../models/catetory');
var DB = require('../models/db');
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
// 分页显示不同类型的电影
router.get('/results',function(req,res){
    var catId = req.query.cat;
    var q = req.query.q;
    var count = 2;
    var page = req.query.p || 1;
    var index = (page-1) * count;
    if(catId){
        Catetory.findById(catId,function(err,catetory){
            var len = catetory.movies.length;
            var result = catetory.movies.splice(index,count);
            res.render('results',{
                title:'分类显示电影列表',
                keyword:catetory.name,
                query:'cat='+catetory._id,
                currentPage:page,
                totalPage:Math.ceil(len/count),
                movies:result
            })
        })
    }else if(q){
        Movie.search(q,function(err,movies){
            if(err){
                return console.error(err);
            }
            var len = movies.length;
            var result = movies.splice(index,count);
            res.render('results',{
                search:true,
                title:'电影搜索结果',
                keyword:q,
                query:'q='+q,
                currentPage:page,
                totalPage:Math.ceil(len/count),
                movies:result
            })
        })  


    }else{
        var temp = '';
        for(var i in req.query){
            temp  = temp + i +',';
        }
        temp = temp.substr(0,temp.length-1);
        var err = new Error('Cannot recognize this query "'+temp+'"');
        err.status = 404;
        res.render('error',{
            error:err
        })
    }

})
module.exports = router;















