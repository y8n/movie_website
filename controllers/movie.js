var Movie = require('../models/movie');
exports.detail = function(req,res){
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
}

exports.new = function(req,res){
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
}
exports.update = function(req,res){
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
}
exports.save = function(req,res){
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
}
exports.list = function(req,res){
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
}
exports.del = function(req,res){
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
}






