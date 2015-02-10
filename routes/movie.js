var express = require('express');
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var fs = require('fs');
var path = require('path');
var router = express.Router();


// 电影详情页
router.get('/movie/:id',function(req,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
        	if(err){
        		console.error(err);
        		return;
        	}
            if(movie){
                Comment.findAllByMoiveId(id,function(err,comments){
                    //console.log('comments')
                    //console.log(comments)
                    res.render('detail',{
                        title:'电影详细信息',
                        movie:movie,
                        comments:comments
                    })
                })
            }else{
                res.render('detail',{
                    title:'电影详细信息'
                })
            }
        });

    }
});

// 用户添加新的电影
router.get('/admin/movie',signinRequired,function(req,res){
    Category.findAllCategory(function(err,categories){
        res.render('admin',{
            title:'电影录入页面',
            movie:{
                title:'',
                doctor:'',
                country:'',
                year:'',
                poster:'',
                flash:'',
                summary:'',
                language:''
            },
            categories:categories
        });
    })
    
});

// 更新电影信息
router.get('/admin/update/:id',signinRequired,adminRequired,function(req,res){
    var id = req.params.id;
    if(id){
    	Movie.findById(id,function(err,movie){
        	if(err){
        		console.error(err);
        		return;
        	}
            Category.findAllCategory(function(err,categories){
                res.render('admin',{
                    title:'后台更新电影',
                    movie:movie,
                    categories:categories
                })
            })
        	
        })
    }
});

// 管理员上传电影信息，在增加了海报自定义以后，需要添加一个中间件来控制海报上传结束之后再更新或存储电影
router.post('/admin/movie/new',signinRequired,function(req,res){
    var movieObj = req.body;
    if(movieObj.category == '其他'){ //判读是否是用户自定义的电影类型
        movieObj.category = movieObj.otherCategory;
    }
    if(req.poster){ //判断是否是自定义上传的电影海报
        movieObj.poster = req.poster;
    }
    var id = movieObj._id;
    var _movie = {};

   if(id != 'undefined'){
        for(var i in movieObj){
            if(i != "_id"){
                _movie[i] = movieObj[i];
            }
        }
        var oldCategory = req.body.oldCategory;
        var updateMovie = new Movie(_movie);
        updateMovie.update(id,function(err,movie){
            if(err){
                console.error(err);
                return;
            }
            Category.removeMovie(oldCategory,id,function(err,category){
                if(err){
                    console.error(err);
                    return;
                }
                Category.save(movie,function(err,category){
                    Category.saveCategory(movieObj.category,function(err,category){
                        if(err){
                            return console.error(err);
                        }
                        console.log('new category:'+movie.category);
                        console.log("Update success");
                        //res.redirect("/movie/"+id);
                        res.send({
                            success:true,
                            pathname:'/movie/'+id
                        })
                    })
                })
            })
        });
    }else{
        _movie = {
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
            category:movieObj.category,
            year:movieObj.year,
            poster:movieObj.poster,
            summary:movieObj.summary,
            flash:movieObj.flash
        }
        var newMovie = new Movie(_movie);
        newMovie.insert(function(err,movie){
            if(err){
                console.error(err);
                return;
            }
            Category.save(movie,function(err,category){
                Category.saveCategory(movieObj.category,function(err,category){
                    if(err){
                        return console.error(err);
                    }
                    console.log("Insert success.New data's id is "+movie._id);
                    //res.redirect('/movie/'+movie._id);
                    res.send({
                        success:true,
                        pathname:'/movie/'+movie._id
                    });
                    return;
                })
            })
        });    
    }
});

// 电影列表
router.get('/admin/movie/list',signinRequired,adminRequired,function(req,res){
    var page = req.query.p  || 1;
    var count = 6;
    var index = (page-1) * count;
    Movie.findAll(function(err,movies){
        if(err){
            console.error(err);
            return;
        }
        var len = movies.length;
        var results = movies.splice(index,count);
        res.render('list',{
            title:'Movie List',
            movies:results,
            currentPage:page,
            totalPage:Math.ceil(len/count)
        });
    })
});

// 删除电影信息
router.post('/admin/movie/list',signinRequired,adminRequired,function(req,res){
    var id = req.query.id;
    if(id){
        Movie.deleteById(id,function(err,movie){
            if(err){
                console.error(err);
                return;
            }
            if(movie){
                console.log("Remove success");
                Category.removeMovie(movie.category,movie._id,function(err,result){//从类型中删除
                    res.send({success:true,msg:"删除成功"})
                })
            }else{
                console.log("No matched data");
                res.send({success:false,msg:"删除失败:电影不存在"})
            }
        });
    }
})
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
// 确保上传电影海报完毕
function savePoster(req,res,next){
    var posterDate = req.files.uploadPoster;
    var filePath = posterDate.path;
    var originalFilename = posterDate.originalFilename;
    console.log(req.files)
    /*
    if(originalFilename){
        fs.readFile(filePath,function(err,data){
            var timestamp = Data.now();
            var type = posterDate.type.split('/')[1];
            var poster = timestamp+'.'+type;
            var newPath = path.join(__dirname,'../../','/public/upload/'+poster);
            fs.writeFile(newPath,data,function(err){
                req.poster = poster;
                
                next();
            })
        })
    }else{
        next();
    }*/
}

module.exports = router;

























