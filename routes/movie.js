var express = require('express');
var Movie = require('../models/movie');
var router = express.Router();


// movie detail page
router.get('/movie/:id',function(req,res){
    var id = req.params.id;
    if(id){
        Movie.findById(id,function(err,doc){
        	if(err){
        		console.error(err);
        		return;
        	}
        	res.render('detail',{
                title:'电影详细信息',
                movie:doc
            })
        })
    }
});

// admin page
router.get('/admin/movie',function(req,res){
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
        }

    });
});

// admin update
router.get('/admin/update/:id',function(req,res){
    var id = req.params.id;
    if(id){
    	Movie.findById(id,function(err,doc){
        	if(err){
        		console.error(err);
        		return;
        	}
        	res.render('admin',{
                title:'后台更新电影',
                movie:doc
            })
        })
    }
});

// admin post movie
router.post('/admin/movie/new',function(req,res){
    var movieObj = req.body;
    var id = movieObj._id;
    var _movie = {};

   if(id != 'undefined'){
        for(var i in movieObj){
            if(i != "_id"){
                _movie[i] = movieObj[i];
            }
        }
        var updateMovie = new Movie(_movie);
        updateMovie.update(id,function(err,doc){
            if(err){
                console.error(err);
                return;
            }
            console.log("Update success");
            res.redirect("/movie/"+id);
        });
    }else{
        _movie = {
            doctor:movieObj.doctor,
            title:movieObj.title,
            country:movieObj.country,
            language:movieObj.language,
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
            console.log("Insert success.New data's id is "+movie._id);
            res.redirect('/movie/'+movie._id);
        });    
    }
});

// list page
router.get('/admin/list',function(req,res){
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
router.post('/admin/list',function(req,res){
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



module.exports = router;









