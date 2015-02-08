var express = require('express');
var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Catetory = require('../models/catetory');
var fs = require('fs');
var path = require('path');
var router = express.Router();


// movie detail page
router.get('/movie/:id',function(req,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function(err,movie){
        	if(err){
        		console.error(err);
        		return;
        	}
            Comment.findAllByMoiveId(id,function(err,comments){
                //console.log('comments')
                //console.log(comments)
                res.render('detail',{
                    title:'电影详细信息',
                    movie:movie,
                    comments:comments
                })
            })
        });

    }
});

// admin page
router.get('/admin/movie',signinRequired,adminRequired,function(req,res){
    Catetory.findAllCatetory(function(err,catetories){
        res.render('admin',{
            title:'后台录入页面',
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
            catetories:catetories
        });
    })
    
});

// admin update
router.get('/admin/update/:id',signinRequired,adminRequired,function(req,res){
    var id = req.params.id;
    if(id){
    	Movie.findById(id,function(err,movie){
        	if(err){
        		console.error(err);
        		return;
        	}
            Catetory.findAllCatetory(function(err,catetories){
                res.render('admin',{
                    title:'后台更新电影',
                    movie:movie,
                    catetories:catetories
                })
            })
        	
        })
    }
});

// 管理员上传电影信息，在增加了海报自定义以后，需要添加一个中间件来控制海报上传结束之后再更新或存储电影
router.post('/admin/movie/new',signinRequired,adminRequired,function(req,res){
    var movieObj = req.body;
    console.log(movieObj)
    if(movieObj.catetory == '其他'){ //判读是否是用户自定义的电影类型
        movieObj.catetory = movieObj.otherCatetory;
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
        var oldCatetory = req.body.oldCatetory;
        var updateMovie = new Movie(_movie);
        updateMovie.update(id,function(err,movie){
            if(err){
                console.error(err);
                return;
            }
            Catetory.removeMovie(oldCatetory,id,function(err,catetory){
                if(err){
                    console.error(err);
                    return;
                }
                Catetory.save(movie,function(err,catetory){
                    Catetory.saveCatetory(movieObj.catetory,function(err,catetory){
                        if(err){
                            return console.error(err);
                        }
                        console.log('new catetory:'+movie.catetory);
                        console.log("Update success");
                        res.redirect("/movie/"+id);
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
            catetory:movieObj.catetory,
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
            Catetory.save(movie,function(err,catetory){
                Catetory.saveCatetory(movieObj.catetory,function(err,catetory){
                    if(err){
                        return console.error(err);
                    }
                    console.log("Insert success.New data's id is "+movie._id);
                    res.redirect('/movie/'+movie._id);
                })
            })
        });    
    }
});

// list page
router.get('/admin/list',signinRequired,adminRequired,function(req,res){
    Movie.findAll(function(err,doc){
        if(err){
            console.error(err);
            return;
        }
        res.render('list',{
            title:'Movie List',
            movies:doc
        });
    })
});

// list delete movie
router.post('/admin/list',signinRequired,adminRequired,function(req,res){
    var id = req.query.id;
    if(id){
        Movie.deleteById(id,function(err,doc){
            if(err){
                console.error(err);
                return;
            }
            if(doc){
                console.log("Remove success");
                res.send({success:true,msg:"删除成功"})
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
    var upload = req.body;
    console.log(upload);
    /*
    var posterDate = req.files.uploadPoster;
    var filePath = posterDate.path;
    var originalFilename = posterDate.originalFilename;

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
    }
    */
}

module.exports = router;

























